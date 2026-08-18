import { Router } from 'express';
import { Role } from '@prisma/client';
import * as controller from './users.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema,
  listUsersSchema,
} from './users.schema.js';

const router = Router();

// All routes require authentication + admin role
router.use(authenticate, authorize(Role.ADMIN));

/**
 * @swagger
 * /users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 */
router.get('/stats', controller.getUserStats);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users with pagination
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 */
router
  .route('/')
  .get(validate(listUsersSchema), controller.listUsers)
  .post(validate(createUserSchema), controller.createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 */
router
  .route('/:id')
  .get(validate(getUserSchema), controller.getUser)
  .put(validate(updateUserSchema), controller.updateUser)
  .delete(validate(deleteUserSchema), controller.deleteUser);

export default router;
