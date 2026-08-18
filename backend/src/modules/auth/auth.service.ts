import crypto from 'crypto';
import { User, Role } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { logger } from '../../config/logger.js';
import { PasswordService } from '../../utils/password.js';
import { JwtService } from '../../utils/jwt.js';
import { emailService } from '../../utils/email.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from '../../utils/AppError.js';
import type {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from './auth.schema.js';

const LOGIN_ATTEMPTS_KEY = (email: string): string => `login_attempts:${email}`;
const LOCKOUT_KEY = (email: string): string => `lockout:${email}`;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 15 * 60; // 15 minutes
const LOGIN_ATTEMPTS_WINDOW = 15 * 60; // 15 minutes

interface AuthResult {
  user: Omit<User, 'password' | 'emailVerifyToken' | 'passwordResetToken'>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(
    data: RegisterInput,
    context: { ipAddress?: string; userAgent?: string },
  ): Promise<{ user: Omit<User, 'password'>; message: string }> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    // Check nationalId if provided
    if (data.nationalId) {
      const existingId = await prisma.user.findUnique({
        where: { nationalId: data.nationalId },
      });
      if (existingId) {
        throw new ConflictError('A user with this national ID already exists');
      }
    }

    // Hash password
    const hashedPassword = await PasswordService.hash(data.password);

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: Role.CITIZEN, // Default role for public registration
        nationalId: data.nationalId,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        phone: data.phone,
        emailVerifyToken: verifyToken,
        emailVerifyExpires: verifyTokenExpires,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_REGISTERED',
        entityType: 'User',
        entityId: user.id,
        userId: user.id,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    // Send verification email (non-blocking)
    emailService
      .sendVerificationEmail(user.email, user.name, verifyToken)
      .catch((err) => logger.error('Failed to send verification email:', err));

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      message: 'Registration successful! Please check your email to verify your account.',
    };
  }

  /**
   * Login user
   */
  static async login(
    data: LoginInput,
    context: { ipAddress?: string; userAgent?: string },
  ): Promise<AuthResult> {
    // Check if account is locked
    const isLocked = await redis.get(LOCKOUT_KEY(data.email));
    if (isLocked) {
      const ttl = await redis.ttl(LOCKOUT_KEY(data.email));
      throw new ForbiddenError(
        `Account is locked due to too many failed login attempts. Try again in ${Math.ceil(ttl / 60)} minutes.`,
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      await this.recordFailedAttempt(data.email);
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Your account has been deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await PasswordService.compare(data.password, user.password);

    if (!isPasswordValid) {
      await this.recordFailedAttempt(data.email);
      throw new UnauthorizedError('Invalid email or password');
    }

    // Clear failed attempts on successful login
    await redis.del(LOGIN_ATTEMPTS_KEY(data.email));

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const { accessToken, refreshToken } = JwtService.generateTokenPair(payload);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        userId: user.id,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    const { password: _, emailVerifyToken: __, passwordResetToken: ___, ...userSafe } = user;

    return {
      user: userSafe,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token (with rotation)
   */
  static async refreshToken(
    oldRefreshToken: string,
    context: { ipAddress?: string; userAgent?: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify token signature
    const payload = JwtService.verifyRefreshToken(oldRefreshToken);

    // Find token in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if token was revoked (potential token reuse attack)
    if (storedToken.revokedAt) {
      // SECURITY: Revoke all user tokens if a revoked token is reused
      logger.warn(`⚠️  Refresh token reuse detected for user ${storedToken.userId}`);
      await prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedError(
        'Refresh token was already used. All sessions have been terminated.',
      );
    }

    // Check expiration
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    // Revoke old token (rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new token pair
    const newPayload = {
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    };
    const { accessToken, refreshToken } = JwtService.generateTokenPair(newPayload);

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: storedToken.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Logout - revoke a specific refresh token
   */
  static async logout(refreshToken: string, userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGOUT',
        entityType: 'User',
        entityId: userId,
        userId,
      },
    });
  }

  /**
   * Logout from all devices
   */
  static async logoutAll(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGOUT_ALL',
        entityType: 'User',
        entityId: userId,
        userId,
      },
    });
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });

    // Send welcome email (non-blocking)
    emailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
      logger.error('Failed to send welcome email:', err);
    });

    return { message: 'Email verified successfully! You can now log in.' };
  }

  /**
   * Resend verification email
   */
  static async resendVerification(email: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success for security (don't leak email existence)
    const successMessage = { message: 'If the email exists, a verification link has been sent.' };

    if (!user || user.isEmailVerified) {
      return successMessage;
    }

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: verifyToken,
        emailVerifyExpires: verifyTokenExpires,
      },
    });

    emailService.sendVerificationEmail(user.email, user.name, verifyToken).catch((err) => {
      logger.error('Failed to send verification email:', err);
    });

    return successMessage;
  }

  /**
   * Request password reset
   */
  static async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success for security
    const successMessage = { message: 'If the email exists, a password reset link has been sent.' };

    if (!user) return successMessage;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: resetExpires,
      },
    });

    // Send reset email (non-blocking)
    emailService.sendPasswordResetEmail(user.email, user.name, resetToken).catch((err) => {
      logger.error('Failed to send password reset email:', err);
    });

    return successMessage;
  }

  /**
   * Reset password using token
   */
  static async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const hashedPassword = await PasswordService.hash(data.password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Revoke all existing tokens (force re-login on all devices)
    await prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        action: 'PASSWORD_RESET',
        entityType: 'User',
        entityId: user.id,
        userId: user.id,
      },
    });

    return { message: 'Password reset successfully! Please log in with your new password.' };
  }

  /**
   * Change password (authenticated user)
   */
  static async changePassword(
    userId: string,
    data: ChangePasswordInput,
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');

    const isCurrentValid = await PasswordService.compare(data.currentPassword, user.password);
    if (!isCurrentValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const hashedPassword = await PasswordService.hash(data.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all tokens except current
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        action: 'PASSWORD_CHANGED',
        entityType: 'User',
        entityId: userId,
        userId,
      },
    });

    return { message: 'Password changed successfully. Please log in again.' };
  }

  /**
   * Get current user profile
   */
  static async getMe(userId: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: {
          select: { id: true, name: true, nameFa: true },
        },
      },
    });

    if (!user) throw new NotFoundError('User not found');

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user's active sessions
   */
  static async getSessions(userId: string): Promise<
    Array<{
      id: string;
      ipAddress: string | null;
      userAgent: string | null;
      createdAt: Date;
      expiresAt: Date;
    }>
  > {
    return prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Revoke a specific session
   */
  static async revokeSession(userId: string, sessionId: string): Promise<void> {
    const session = await prisma.refreshToken.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) throw new NotFoundError('Session not found');

    await prisma.refreshToken.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Record failed login attempt and lock account if needed
   */
  private static async recordFailedAttempt(email: string): Promise<void> {
    const attempts = await redis.incr(LOGIN_ATTEMPTS_KEY(email));

    if (attempts === 1) {
      await redis.expire(LOGIN_ATTEMPTS_KEY(email), LOGIN_ATTEMPTS_WINDOW);
    }

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      await redis.setex(LOCKOUT_KEY(email), LOCKOUT_DURATION_SECONDS, '1');
      logger.warn(`🔒 Account locked due to failed login attempts: ${email}`);
    }
  }
}
