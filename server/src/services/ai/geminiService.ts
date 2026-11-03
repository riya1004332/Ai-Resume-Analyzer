import { ZodType } from 'zod';
import { aiClient } from '../../config/ai';
import { env } from '../../config/env';
import { SYSTEM_INSTRUCTION } from '../../prompts/systemPrompt';

export interface GenerateAIOptions<T> {
  prompt: string;
  schema: ZodType<T, any, any>;
  moduleName: string;
  mockFallback?: () => T;
}

/**
 * Clean potential markdown wrappers and return sanitized JSON string
 */
function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

/**
 * Robust JSON extraction and repair
 */
export async function generateAIResponse<T>(options: {
  systemInstruction?: string;
  prompt: string;
  schema: ZodType<T, any, any>;
  moduleName: string;
  mockFallback?: () => T;
}): Promise<T> {
  const {
    systemInstruction = SYSTEM_INSTRUCTION,
    prompt,
    schema,
    moduleName,
    mockFallback
  } = options;

  // If no Gemini client is configured or running in development without key, use the structured mock fallback
  if (!aiClient) {
    if (mockFallback) {
      console.log(`[AI-Service] Using structured fallback generator for module: ${moduleName}`);
      const fallbackData = mockFallback();
      return schema.parse(fallbackData);
    }
    throw new Error('Gemini API key is not configured and no mock fallback was provided.');
  }

  const client = aiClient;
  const model = env.GEMINI_MODEL || 'gemini-1.5-flash';

  const makeCall = async (contents: string, customInstruction?: string) => {
    const response = await client.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: customInstruction || systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    return response.text || '';
  };

  try {
    console.log(`[AI-Service] Calling Gemini (${model}) for ${moduleName}...`);
    const rawOutput = await makeCall(prompt);
    const cleaned = cleanJsonResponse(rawOutput);

    try {
      const parsedJson = JSON.parse(cleaned);
      const validated = schema.parse(parsedJson);
      return validated;
    } catch (parseOrValidationError: any) {
      console.warn(`[AI-Service] First attempt output validation failed for ${moduleName}:`, parseOrValidationError.message);
      
      // Step 2: One controlled repair attempt as mandated by Section 13
      console.log(`[AI-Service] Attempting 1 controlled repair for ${moduleName}...`);
      const repairPrompt = `The previous response failed schema validation.
Previous raw output:
${cleaned.slice(0, 1000)}

Validation error details:
${parseOrValidationError.message}

Please repair the JSON so that it strictly adheres to the requested schema. Return JSON only, without markdown code fences.`;

      const repairedRaw = await makeCall(repairPrompt, 'You are a JSON repair specialist. Output only valid JSON conforming strictly to the requested schema.');
      const repairedCleaned = cleanJsonResponse(repairedRaw);
      const repairedJson = JSON.parse(repairedCleaned);
      const repairedValidated = schema.parse(repairedJson);

      console.log(`[AI-Service] Repaired JSON validated successfully for ${moduleName}`);
      return repairedValidated;
    }
  } catch (error: any) {
    console.error(`[AI-Service] Error during AI generation for ${moduleName}:`, error);

    // If Gemini fails and we have a valid fallback, return schema-validated fallback data
    if (mockFallback) {
      console.log(`[AI-Service] Falling back to schema-compliant response for ${moduleName}`);
      return schema.parse(mockFallback());
    }

    throw new Error(`AI generation failed for ${moduleName}: ${error.message}`);
  }
}
