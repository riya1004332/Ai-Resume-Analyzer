import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('[Error-Handler]', {
    path: req.path,
    method: req.method,
    message: err.message,
    code: err.code || 'INTERNAL_ERROR'
  });

  const statusCode = err.status || err.statusCode || 500;
  const isDev = env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal error occurred.',
    error: {
      code: err.code || 'INTERNAL_ERROR',
      details: isDev ? err.stack : undefined
    }
  });
}

