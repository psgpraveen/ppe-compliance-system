import { Request } from 'express';

export interface TokenPayload {
  userId: string;
  role: 'ADMIN' | 'SUPERVISOR';
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
