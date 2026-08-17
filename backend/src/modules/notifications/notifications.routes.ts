import { Router } from 'express';
import * as controller from './notifications.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { listNotificationsSchema, notificationIdSchema } from './notifications.schema.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: List my notifications
 *     tags: [Notifications]
 */
router.get('/', validate(listNotificationsSchema), controller.listNotifications);

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notifications count
 *     tags: [Notifications]
 */
router.get('/unread-count', controller.getUnreadCount);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 */
router.put('/read-all', controller.markAllAsRead);

/**
 * @swagger
 * /notifications/read:
 *   delete:
 *     summary: Delete all read notifications
 *     tags: [Notifications]
 */
router.delete('/read', controller.deleteAllRead);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 */
router.put('/:id/read', validate(notificationIdSchema), controller.markAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 */
router.delete('/:id', validate(notificationIdSchema), controller.deleteNotification);

export default router;
