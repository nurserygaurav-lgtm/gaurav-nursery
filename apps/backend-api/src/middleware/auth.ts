import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthenticatedUser, UserRole } from '@gaurav-nursery/types';
import { env } from '../config/env.js';

declare global { namespace Express { interface Request { auth?: AuthenticatedUser; } } }

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Access token is required' } });
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthenticatedUser;
    req.auth = payload;
    return next();
  } catch { return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Access token is invalid or expired' } }); }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication is required' } });
    if (!roles.includes(req.auth.role)) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient permission' } });
    return next();
  };
}
