import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from './AppError.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtService {
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as SignOptions);
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions);
  }

  static verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Access token expired');
      }
      throw new UnauthorizedError('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Refresh token expired');
      }
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  static generateTokenPair(payload: JwtPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
