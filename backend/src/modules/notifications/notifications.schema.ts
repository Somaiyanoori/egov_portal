import { z } from 'zod';
import { NotificationType } from '@prisma/client';
import { paginationSchema } from '../../utils/pagination.js';

export const listNotificationsSchema = z.object({
  query: paginationSchema.extend({
    isRead: z.coerce.boolean().optional(),
    type: z.nativeEnum(NotificationType).optional(),
  }),
});

export const notificationIdSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid notification ID'),
  }),
});

export type ListNotificationsInput = z.infer<typeof listNotificationsSchema>['query'];
