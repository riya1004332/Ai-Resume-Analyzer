import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ExtractionResult {
  text: string;
  fileType: 'pdf' | 'docx';
  charCount: number;
  wordCount: number;
}

/**
 * Validates document magic bytes (file signature) to prevent extension spoofing
 */
export function validateFileSignature(buffer: Buffer): 'pdf' | 'docx' {
  if (buffer.length < 4) {
    throw new Error('File buffer is too short to determine file type.');
  }

  // PDF magic numbers: %PDF (0x25 0x50 0x44 0x46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return 'pdf';
  }

  // DOCX (ZIP archive) magic numbers: PK\x03\x04 (0x50 0x4B 0x03 0x04)
  if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  ) {
    return 'docx';
  }

  throw new Error('Invalid file format. Uploaded file signature does not match PDF or DOCX specifications.');
}

/**
 * Extracts readable plain text from PDF or DOCX buffer
 */
export async function extractResumeText(
  buffer: Buffer,
  declaredType?: string
): Promise<ExtractionResult> {
  const verifiedType = validateFileSignature(buffer);

  if (declaredType && declaredType !== verifiedType) {
    throw new Error(`File declared as ${declaredType} but signature matches ${verifiedType}.`);
  }

  let rawText = '';

  if (verifiedType === 'pdf') {
    const parsedPdf = await pdfParse(buffer);
    rawText = parsedPdf.text || '';
  } else if (verifiedType === 'docx') {
    const parsedDocx = await mammoth.extractRawText({ buffer });
    rawText = parsedDocx.value || '';
  }

  // Clean and sanitize whitespace
  const cleanedText = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim();

  if (!cleanedText || cleanedText.length < 50) {
    throw new Error(
      'Unable to extract readable text from document. Ensure the resume is not an image-only scan or password protected.'
    );
  }

  // Limit maximum resume text length sent to model (security & token limits)
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

