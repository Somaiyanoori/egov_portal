import { Request, Response } from 'express';
import { NotificationsService } from './notifications.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UnauthorizedError } from '../../utils/AppError.js';

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const { notifications, meta, unreadCount } = await NotificationsService.list(
    req.user.id,
    req.query as any,
  );

  return ApiResponse.success(
    res,
    { notifications, unreadCount },
    'Notifications retrieved',
    200,
    meta,
  );
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const count = await NotificationsService.getUnreadCount(req.user.id);
  return ApiResponse.success(res, { unreadCount: count }, 'Unread count retrieved');
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const notification = await NotificationsService.markAsRead(req.params.id, req.user.id);
  return ApiResponse.success(res, notification, 'Notification marked as read');
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const result = await NotificationsService.markAllAsRead(req.user.id);
  return ApiResponse.success(res, result, 'All notifications marked as read');
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  await NotificationsService.delete(req.params.id, req.user.id);
  return ApiResponse.success(res, null, 'Notification deleted');
});

export const deleteAllRead = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const result = await NotificationsService.deleteAllRead(req.user.id);
  return ApiResponse.success(res, result, 'Read notifications deleted');
});
