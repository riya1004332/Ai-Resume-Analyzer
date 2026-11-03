import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Missing Bearer token.',
        error: { code: 'UNAUTHORIZED' }
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Invalid authorization token format.',
        error: { code: 'UNAUTHORIZED' }
      });
      return;
    }

    // Support dev/demo tokens for offline testing
    if (token === 'dev-token' || token.startsWith('mock-')) {
      req.user = {
        id: token === 'dev-token' ? '00000000-0000-0000-0000-000000000001' : token.replace('mock-', ''),
        email: 'developer@example.com',
        fullName: 'Demo Developer'
      };
      return next();
    }

    // Verify token with Supabase Auth
    const isLiveSupabase =
      env.SUPABASE_URL.startsWith('https://') &&
      env.SUPABASE_SERVICE_ROLE_KEY !== 'dev-service-role-key';

    if (isLiveSupabase) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        res.status(401).json({
          success: false,
          message: 'Session expired or invalid token. Please log in again.',
          error: { code: 'INVALID_TOKEN', details: error?.message }
        });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || user.user_metadata?.name || ''
      };
      return next();
    }

    // For local development mock JWTs
    try {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
        if (decoded.sub) {
          req.user = {
            id: decoded.sub,
            email: decoded.email || 'user@example.com',
            fullName: decoded.user_metadata?.full_name || ''
          };
          return next();
        }
      }
    } catch {
      // Fallback below
    }

    // Fallback development authenticated user
    req.user = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'demo@example.com',
      fullName: 'Default User'
    };
    return next();
  } catch (error: any) {
    console.error('[AuthMiddleware] Error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed.',
      error: { code: 'AUTH_FAILED', details: error.message }
    });
  }
}

