import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CookieService } from '../../utils/cookies.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UnauthorizedError } from '../../utils/AppError.js';
import { COOKIE_NAMES } from '../../utils/constants.js';

const getContext = (req: Request): { ipAddress?: string; userAgent?: string } => ({
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});

/**
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body, getContext(req));
  return ApiResponse.created(res, result.user, result.message);
});

/**
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body, getContext(req));

  // Set cookies
  CookieService.setAuthCookies(res, result.accessToken, result.refreshToken);

  return ApiResponse.success(
    res,
    {
      user: result.user,
      accessToken: result.accessToken, // Also return in body for mobile apps
    },
    'Login successful',
  );
});

/**
 * POST /api/v1/auth/refresh
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] || req.body.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token required');
  }

  const tokens = await AuthService.refreshToken(refreshToken, getContext(req));

  // Set new cookies
  CookieService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  return ApiResponse.success(
    res,
    { accessToken: tokens.accessToken },
    'Token refreshed successfully',
  );
});

/**
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];

  if (refreshToken && req.user) {
    await AuthService.logout(refreshToken, req.user.id);
  }

  CookieService.clearAuthCookies(res);
  return ApiResponse.success(res, null, 'Logged out successfully');
});

/**
 * POST /api/v1/auth/logout-all
 */
export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  await AuthService.logoutAll(req.user.id);
  CookieService.clearAuthCookies(res);
  return ApiResponse.success(res, null, 'Logged out from all devices');
});

/**
 * POST /api/v1/auth/verify-email
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.verifyEmail(req.body.token);
  return ApiResponse.success(res, null, result.message);
});

/**
 * POST /api/v1/auth/resend-verification
 */
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.resendVerification(req.body.email);
  return ApiResponse.success(res, null, result.message);
});

/**
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword(req.body.email);
  return ApiResponse.success(res, null, result.message);
});

/**
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.resetPassword(req.body);
  return ApiResponse.success(res, null, result.message);
});

/**
 * POST /api/v1/auth/change-password
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const result = await AuthService.changePassword(req.user.id, req.body);
  CookieService.clearAuthCookies(res); // Force re-login
  return ApiResponse.success(res, null, result.message);
});

/**
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const user = await AuthService.getMe(req.user.id);
  return ApiResponse.success(res, user, 'User profile retrieved');
});

/**
 * GET /api/v1/auth/sessions
 */
export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const sessions = await AuthService.getSessions(req.user.id);
  return ApiResponse.success(res, sessions, 'Active sessions retrieved');
});

/**
 * DELETE /api/v1/auth/sessions/:sessionId
 */
export const revokeSession = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  await AuthService.revokeSession(req.user.id, req.params.sessionId);
  return ApiResponse.success(res, null, 'Session revoked');
});
