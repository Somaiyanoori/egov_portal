import { Response, CookieOptions } from 'express';
import { env, isProduction } from '../config/env.js';
import { COOKIE_NAMES } from './constants.js';

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  domain: isProduction ? env.COOKIE_DOMAIN : undefined,
  path: '/',
};

export class CookieService {
  static setAccessToken(res: Response, token: string): void {
    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, token, {
      ...baseCookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
  }

  static setRefreshToken(res: Response, token: string): void {
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, token, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth', // Only sent to auth endpoints
    });
  }

  static setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    this.setAccessToken(res, accessToken);
    this.setRefreshToken(res, refreshToken);
  }

  static clearAuthCookies(res: Response): void {
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, { ...baseCookieOptions });
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
      ...baseCookieOptions,
      path: '/api/v1/auth',
    });
  }
}
