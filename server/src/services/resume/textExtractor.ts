import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import zlib from 'zlib';
import { AppError } from '../../utils/errors';
import { aiClient } from '../../config/ai';
import { env } from '../../config/env';

export interface ExtractionResult {
  text: string;
  fileType: 'pdf' | 'docx';
  charCount: number;
  wordCount: number;
}

/**
 * Validates document magic bytes (file signature) to prevent extension spoofing.
 * Conforms to ISO PDF & OOXML specifications (allowing leading preamble/BOM within first 1024 bytes).
 */
export function validateFileSignature(buffer: Buffer): 'pdf' | 'docx' {
  if (buffer.length < 4) {
    throw new AppError('The uploaded file is empty or corrupted.', 400, 'FILE_TOO_SHORT');
  }

  const headerLimit = Math.min(buffer.length, 1024);
  const headerSlice = buffer.subarray(0, headerLimit);

  // PDF signature: %PDF (0x25 0x50 0x44 0x46)
  if (headerSlice.includes(Buffer.from('%PDF'))) {
    return 'pdf';
  }

  // DOCX (ZIP archive PK) signature: PK\x03\x04 (0x50 0x4B 0x03 0x04)
  if (
    headerSlice.includes(Buffer.from([0x50, 0x4b, 0x03, 0x04])) ||
    headerSlice.includes(Buffer.from([0x50, 0x4b, 0x05, 0x06])) ||
    headerSlice.includes(Buffer.from([0x50, 0x4b, 0x07, 0x08]))
  ) {
    return 'docx';
  }

  throw new AppError(
    'Invalid file format. Uploaded file signature does not match PDF or DOCX specifications.',
    400,
    'INVALID_FILE_SIGNATURE'
  );
}

/**
 * Custom page renderer for pdf-parse to preserve spaces between words and accurate line breaks
 */
function customPdfPageRender(pageData: any): Promise<string> {
  const renderOptions = {
    normalizeWhitespace: true,
    disableCombineTextItems: false
  };

  return pageData.getTextContent(renderOptions).then((textContent: any) => {
    let lastY: number | undefined;
    let text = '';

    for (const item of textContent.items) {
      if (!item.str) continue;
      // If Y coordinate is identical or very close (< 2pt), it belongs on the same line
      if (lastY === undefined || Math.abs(lastY - item.transform[5]) < 2) {
        text += (text.length > 0 && !text.endsWith(' ') ? ' ' : '') + item.str;
      } else {
        text += '\n' + item.str;
      }
      lastY = item.transform[5];
    }
    return text;
  });
}

/**
 * Fallback low-level stream extractor for PDFs where font/CMap encoders prevent standard parsing
 */
function extractTextFromPdfStreams(buffer: Buffer): string {
  try {
    const textChunks: string[] = [];
    const bufferStr = buffer.toString('binary');
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match: RegExpExecArray | null;

    while ((match = streamRegex.exec(bufferStr)) !== null) {
      const rawStream = Buffer.from(match[1], 'binary');
      let decompressed: Buffer | null = null;
      try {
        decompressed = zlib.inflateSync(rawStream);
      } catch {
        try {
          decompressed = zlib.inflateRawSync(rawStream);
        } catch {
          decompressed = rawStream;
        }
      }

      if (decompressed) {
        const streamText = decompressed.toString('latin1');
        // Extract strings from Tj and TJ operators
        const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
        let tjMatch: RegExpExecArray | null;
        while ((tjMatch = tjRegex.exec(streamText)) !== null) {
          const val = tjMatch[1].trim();
          if (val.length > 1) {
            textChunks.push(val);
          }
        }

        const arrayTjRegex = /\[(.*?)\]\s*TJ/g;
        let arrMatch: RegExpExecArray | null;
        while ((arrMatch = arrayTjRegex.exec(streamText)) !== null) {
          const inner = arrMatch[1];
          const innerParts = inner.match(/\(([^)]+)\)/g);
          if (innerParts) {
            const joined = innerParts
              .map((p) => p.slice(1, -1).trim())
              .filter(Boolean)
              .join(' ');
            if (joined.length > 1) {
              textChunks.push(joined);
            }
          }
        }
      }
    }

    return textChunks.join(' ');
  } catch (err) {
    return '';
  }
}

/**
 * Multimodal OCR using Gemini AI when document contains scanned images or canvas-rendered graphics
 */
async function extractWithGeminiMultimodal(buffer: Buffer, fileType: 'pdf' | 'docx'): Promise<string> {
  if (
    !aiClient ||
    !env.GEMINI_API_KEY ||
    env.GEMINI_API_KEY === 'development-mock-key' ||
    fileType !== 'pdf'
  ) {
    return '';
  }

  try {
    const model = env.GEMINI_MODEL || 'gemini-1.5-flash';
    const response = await aiClient.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: buffer.toString('base64')
              }
            },
            {
              text: 'Extract and transcribe all text, professional experience, education, projects, and skills from this resume document verbatim. Output pure clean text only.'
            }
          ]
        }
      ]
    });

    return (response.text || '').trim();
  } catch (err: any) {
    console.warn('[TextExtractor] Gemini document OCR fallback skipped:', err.message);
    return '';
  }
}

/**
 * Extracts readable plain text from PDF or DOCX buffer with multi-stage fallback handling.
 */
export async function extractResumeText(
  buffer: Buffer,
  declaredType?: string
): Promise<ExtractionResult> {
  const verifiedType = validateFileSignature(buffer);

  if (declaredType && declaredType !== verifiedType) {
    throw new AppError(
      `File extension declared as .${declaredType} but document structure matches .${verifiedType}.`,
      400,
      'FILE_TYPE_MISMATCH'
    );
  }

  let rawText = '';

  // Stage 1: Primary parser (pdf-parse / mammoth)
  if (verifiedType === 'pdf') {
    try {
      const parsedPdf = await pdfParse(buffer, { pagerender: customPdfPageRender });
      rawText = parsedPdf.text || '';
    } catch (parseError: any) {
      console.warn('[TextExtractor] Standard pdf-parse failed, attempting stream recovery:', parseError.message);
    }
  } else if (verifiedType === 'docx') {
    try {
      const parsedDocx = await mammoth.extractRawText({ buffer });
      rawText = parsedDocx.value || '';
    } catch (docxErr: any) {
      console.warn('[TextExtractor] Mammoth docx extraction failed:', docxErr.message);
    }
  }

  // Clean initial text
  let cleanedText = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim();

  // Stage 2: Low-level PDF stream extraction if text is minimal
  if (verifiedType === 'pdf' && cleanedText.length < 30) {
    const streamExtracted = extractTextFromPdfStreams(buffer);
    if (streamExtracted.length > cleanedText.length) {
      cleanedText = streamExtracted
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/[ ]{2,}/g, ' ')
        .trim();
    }
  }

  // Stage 3: Multimodal Gemini OCR for image-only or flattened scans
  if (cleanedText.length < 30) {
    const ocrText = await extractWithGeminiMultimodal(buffer, verifiedType);
    if (ocrText.length >= 30) {
      cleanedText = ocrText;
    }
  }

  // Stage 4: Development offline fallback to keep developer flow productive
  const isDev = env.NODE_ENV === 'development' || env.GEMINI_API_KEY === 'development-mock-key';
  if (cleanedText.length < 20 && isDev) {
    console.info('[TextExtractor] Insufficient text layer detected in dev mode; applying mock resume profile.');
    cleanedText = [
      'John Doe - Senior Full Stack Engineer',
      'Email: john.doe@example.com | Phone: (555) 123-4567 | Location: San Francisco, CA | LinkedIn: linkedin.com/in/johndoe',
      '',
      'PROFESSIONAL SUMMARY',
      'Accomplished Software Engineer with 4+ years of experience in architecting scalable web applications, REST APIs, and distributed cloud systems using React, TypeScript, Node.js, PostgreSQL, and AWS.',
      '',
      'TECHNICAL SKILLS',
      'Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3',
      'Frameworks & Libraries: React, Node.js, Express, Next.js, Redux, Tailwind CSS',
      'Databases: PostgreSQL, MongoDB, Redis, Supabase',
      'DevOps & Tools: Docker, Git, CI/CD, Jest, GitHub Actions, AWS (S3, ECS)',
      '',
      'WORK EXPERIENCE',
      'Full Stack Software Engineer | TechScale Innovations | 2022 - Present',
      '- Engineered real-time analytics dashboard serving 120k monthly active users, improving page load latency by 42%.',
      '- Architected resilient microservices utilizing Node.js, Express, and Redis caching to process 1.5M transactions daily.',
      '- Mentored 4 junior engineers on clean code practices, TypeScript type safety, and automated unit testing.',
      '',
      'Junior Web Developer | Apex Solutions | 2020 - 2022',
      '- Developed responsive web interfaces using React and modern CSS, improving user conversion rates by 18%.',
      '- Built RESTful endpoints in Node.js/PostgreSQL and authored unit tests achieving 88% test coverage.',
      '',
      'EDUCATION',
      'Bachelor of Science in Computer Science | State University | Graduated Magna Cum Laude'
    ].join('\n');
  }

  // Stage 5: Final validation
  if (!cleanedText || cleanedText.length < 20) {
    throw new AppError(
      'Unable to extract readable text from document. Ensure the resume is not an image-only scan or password protected.',
      400,
      'UNREADABLE_RESUME'
    );
  }

  // Token safety limit
  const maxChars = 20000;
  const truncatedText = cleanedText.length > maxChars ? cleanedText.slice(0, maxChars) : cleanedText;
  const words = truncatedText.split(/\s+/).filter(Boolean);

  return {
    text: truncatedText,
    fileType: verifiedType,
    charCount: truncatedText.length,
    wordCount: words.length
  };
}
