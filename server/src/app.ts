import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  // Basic security and request parsing
  app.disable('x-powered-by');

  // Strict CORS configuration
  app.use(
    cors({
      origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      model: env.GEMINI_MODEL,
      env: env.NODE_ENV
    });
  });

  // Mount API v1 router
  app.use('/api/v1', apiRouter);

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

