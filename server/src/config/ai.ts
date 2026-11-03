import { GoogleGenAI } from '@google/genai';
import { env } from './env';

export const aiClient = env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'development-mock-key'
  ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
  : null;

