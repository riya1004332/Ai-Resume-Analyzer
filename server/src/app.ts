import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  // Basic security and request parsing
  app.disable('x-powered-by');

  // Flexible CORS configuration supporting custom frontend URLs, previews, and localhost
  const configuredOrigins = (env.FRONTEND_URL || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
  const allowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultOrigins]));

  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          allowedOrigins.includes('*') ||
          origin.endsWith('.vercel.app') ||
          origin.endsWith('.netlify.app')
        ) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint (support /, /health, /api, and /api/health)
  app.get(['/', '/health', '/api', '/api/health'], (req, res) => {
    res.json({
      status: 'healthy',
      name: 'AI Resume Analyzer API',
      timestamp: new Date().toISOString(),
      model: env.GEMINI_MODEL,
      env: env.NODE_ENV
    });
  });

  // Mount API router across /api/v1, /v1, and /api
  app.use(['/api/v1', '/v1', '/api'], apiRouter);

  // 404 handler for undefined API routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.path}`,
      error: { code: 'NOT_FOUND' }
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}

