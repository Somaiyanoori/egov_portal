import { Notification, NotificationType, Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { socketService } from '../../config/socket.js';
import { NotFoundError, ForbiddenError } from '../../utils/AppError.js';
import { getPaginationMeta, getPrismaSkipTake, PaginationMeta } from '../../utils/pagination.js';
import type { ListNotificationsInput } from './notifications.schema.js';

export class NotificationsService {
  static async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    metadata?: Record<string, unknown>;
  }): Promise<Notification> {
    const notification = await prisma.notification.create({
      data: {
        ...data,
        metadata: data.metadata as Prisma.InputJsonValue,
      },
    });

    socketService.emitToUser(data.userId, 'notification:new', notification);

    const unreadCount = await this.getUnreadCount(data.userId);
    socketService.emitToUser(data.userId, 'notification:count', { unreadCount });

    return notification;
  }

  static async list(
    userId: string,
    params: ListNotificationsInput,
  ): Promise<{ notifications: Notification[]; meta: PaginationMeta; unreadCount: number }> {
    const { page, limit, sortBy, sortOrder, isRead, type } = params;

    const where: Prisma.NotificationWhereInput = { userId };
    if (isRead !== undefined) where.isRead = isRead;
    if (type) where.type = type;

    const orderBy: Prisma.NotificationOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder }
      : { createdAt: 'desc' };

    const { skip, take } = getPrismaSkipTake(page, limit);

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where, orderBy, skip, take }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      notifications,
      meta: getPaginationMeta(total, page, limit),
      unreadCount,
    };
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  static async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) throw new NotFoundError('Notification not found');
    if (notification.userId !== userId) {
      throw new ForbiddenError('You cannot modify this notification');
    }

    if (notification.isRead) return notification;

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });

    const unreadCount = await this.getUnreadCount(userId);
    socketService.emitToUser(userId, 'notification:count', { unreadCount });

    return updated;
  }

  static async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    socketService.emitToUser(userId, 'notification:count', { unreadCount: 0 });
    socketService.emitToUser(userId, 'notification:all-read', {});

    return { count: result.count };
  }

  static async delete(id: string, userId: string): Promise<void> {
    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) throw new NotFoundError('Notification not found');
    if (notification.userId !== userId) {
      throw new ForbiddenError('You cannot delete this notification');
    }

    await prisma.notification.delete({ where: { id } });

    const unreadCount = await this.getUnreadCount(userId);
    socketService.emitToUser(userId, 'notification:count', { unreadCount });
  }

  static async deleteAllRead(userId: string): Promise<{ count: number }> {
    const result = await prisma.notification.deleteMany({
      where: { userId, isRead: true },
    });
    return { count: result.count };
  }
}
