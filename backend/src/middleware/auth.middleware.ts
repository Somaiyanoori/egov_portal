import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../config/database.js';
import { JwtService } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/AppError.js';
import { COOKIE_NAMES } from '../utils/constants.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Authenticate: verify JWT and attach user to request
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Extract token from cookie or Authorization header
    let token: string | undefined = req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN];

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required. Please log in.');
    }

    // Verify token
    const payload = JwtService.verifyAccessToken(token);

    // Fetch user (ensure they still exist and are active)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        departmentId: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Your account has been deactivated');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    };

    next();
  },
);

/**
 * Authorize: check user role
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
    }

    next();
  };
};

/**
 * Optional authentication (attach user if token present, don't error if not)
 */
export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined = req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN];

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return next();
    }

    try {
      const payload = JwtService.verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          role: true,
          departmentId: true,
          isActive: true,
        },
      });

      if (user?.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId,
        };
      }
    } catch {
      // Silently fail for optional auth
    }

    next();
  },
);
