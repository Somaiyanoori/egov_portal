import { Router } from 'express';
import { Role } from '@prisma/client';
import * as controller from './requests.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { uploadMultiple } from '../../middleware/upload.middleware.js';
import {
  createRequestSchema,
  requestIdSchema,
  processRequestSchema,
  listRequestsSchema,
} from './requests.schema.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /requests/my/stats:
 *   get:
 *     summary: Get my request statistics (citizen)
 *     tags: [Requests]
 */
router.get('/my/stats', authorize(Role.CITIZEN), controller.getMyStats);

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: List requests (scoped by role)
 *     tags: [Requests]
 *   post:
 *     summary: Create new request with documents (citizen)
 *     tags: [Requests]
 */
router
  .route('/')
  .get(validate(listRequestsSchema), controller.listRequests)
  .post(
    authorize(Role.CITIZEN),
    uploadMultiple('documents', 5),
    validate(createRequestSchema),
    controller.createRequest,
  );

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Get request details
 *     tags: [Requests]
 */
router.get('/:id', validate(requestIdSchema), controller.getRequest);

/**
 * @swagger
 * /requests/{id}/process:
 *   put:
 *     summary: Process request (officer/head/admin)
 *     tags: [Requests]
 */
router.put(
  '/:id/process',
  authorize(Role.OFFICER, Role.HEAD, Role.ADMIN),
  validate(processRequestSchema),
  controller.processRequest,
);

/**
 * @swagger
 * /requests/{id}/cancel:
 *   put:
 *     summary: Cancel request (citizen)
 *     tags: [Requests]
 */
router.put(
  '/:id/cancel',
  authorize(Role.CITIZEN),
  validate(requestIdSchema),
  controller.cancelRequest,
);

export default router;
