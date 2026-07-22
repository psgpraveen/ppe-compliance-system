import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';

const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export const loginRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 15; // Max 15 attempts per IP per 15 minutes

  const record = loginAttempts.get(ip);

  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxAttempts) {
    return next(new AppError('Too many failed login attempts. Please try again after 15 minutes for security reasons.', 429));
  }

  record.count += 1;
  next();
};
