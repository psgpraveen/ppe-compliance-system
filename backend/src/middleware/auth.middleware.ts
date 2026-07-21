import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyAccessToken } from '../shared/utils/jwt';
import { AppError } from '../shared/errors/AppError';
import { TokenPayload } from '../shared/types';

export const authenticate: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized. Token missing.', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    next(new AppError('Unauthorized. Invalid or expired token.', 401));
  }
};

export const authorize = (roles: Array<TokenPayload['role']>): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError('Forbidden. Insufficient permissions.', 403));
      return;
    }
    next();
  };
};
