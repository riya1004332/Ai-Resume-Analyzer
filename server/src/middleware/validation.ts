import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed for request body.',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.errors.map((e) => ({
              field: e.path.join('.'),
              message: e.message
            }))
          }
        });
        return;
      }
      next(error);
    }
  };
}

export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed for query parameters.',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.errors.map((e) => ({
              field: e.path.join('.'),
              message: e.message
            }))
          }
        });
        return;
      }
      next(error);
    }
  };
}

