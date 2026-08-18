import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { env } from './env.js';
import { logger } from './logger.js';
import { JwtService } from '../utils/jwt.js';
import { COOKIE_NAMES } from '../utils/constants.js';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

/**
 * Simple cookie parser (no external dependency needed)
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}

class SocketService {
  private io: SocketServer | null = null;
  private userSockets: Map<string, Set<string>> = new Map();

  initialize(httpServer: HttpServer): void {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
        credentials: true,
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.io.use((socket: AuthenticatedSocket, next) => {
      try {
        let token: string | undefined;

        // Try to get token from cookie header
        const cookieHeader = socket.handshake.headers.cookie;
        if (cookieHeader) {
          const cookies = parseCookies(cookieHeader);
          token = cookies[COOKIE_NAMES.ACCESS_TOKEN];
        }

        // Try auth object (for direct token passing)
        if (!token) {
          token = socket.handshake.auth?.token;
        }

        // Try Authorization header
        if (!token) {
          const authHeader = socket.handshake.headers.authorization;
          if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.substring(7);
          }
        }

        if (!token) {
          return next(new Error('Authentication required'));
        }

        const payload = JwtService.verifyAccessToken(token);
        socket.userId = payload.userId;
        socket.userRole = payload.role;
        next();
      } catch (error) {
        logger.warn('Socket auth failed:', error);
        next(new Error('Invalid token'));
      }
    });

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const userId = socket.userId!;
      logger.info(`🔌 User connected: ${userId} (socket: ${socket.id})`);

      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(socket.id);

      socket.join(`user:${userId}`);
      if (socket.userRole) socket.join(`role:${socket.userRole}`);

      socket.emit('connected', { message: 'Connected to real-time notifications', userId });

      socket.on('disconnect', (reason) => {
        logger.info(`🔌 User disconnected: ${userId} (reason: ${reason})`);
        const sockets = this.userSockets.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) this.userSockets.delete(userId);
        }
      });

      socket.on('ping', () => socket.emit('pong', { timestamp: Date.now() }));
    });

    logger.info('✅ Socket.io initialized');
  }

  emitToUser(userId: string, event: string, data: unknown): void {
    if (!this.io) return;
    this.io.to(`user:${userId}`).emit(event, data);
    logger.debug(`📤 Sent '${event}' to user ${userId}`);
  }

  emitToUsers(userIds: string[], event: string, data: unknown): void {
    if (!this.io) return;
    userIds.forEach((userId) => this.emitToUser(userId, event, data));
  }

  emitToRole(role: string, event: string, data: unknown): void {
    if (!this.io) return;
    this.io.to(`role:${role}`).emit(event, data);
  }

  broadcast(event: string, data: unknown): void {
    if (!this.io) return;
    this.io.emit(event, data);
  }

  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  getIO(): SocketServer | null {
    return this.io;
  }
}

export const socketService = new SocketService();
