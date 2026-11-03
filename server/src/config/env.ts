import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.string().default('http://127.0.0.1:54321'),
  SUPABASE_ANON_KEY: z.string().default('dev-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('dev-service-role-key'),
  GEMINI_API_KEY: z.string().default('development-mock-key'),
  GEMINI_MODEL: z.string().default('gemini-1.5-flash'),
  MAX_RESUME_SIZE: z.string().transform((val) => parseInt(val, 10)).default('5242880'),
  RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform((val) => parseInt(val, 10)).default('100')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  // In development, allow defaults if missing
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export const env = parsed.success ? parsed.data : {
  NODE_ENV: (process.env.NODE_ENV as any) || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  SUPABASE_URL: process.env.SUPABASE_URL || 'http://127.0.0.1:54321',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'dev-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-service-role-key',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'development-mock-key',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  MAX_RESUME_SIZE: parseInt(process.env.MAX_RESUME_SIZE || '5242880', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
};
