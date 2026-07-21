import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import { TokenPayload } from '../types';

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET as Secret, { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] });
  
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};
