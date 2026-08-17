import { Router } from 'express';
import { Role } from '@prisma/client';
import * as controller from './services.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate, authorize, optionalAuth } from '../../middleware/auth.middleware.js';
import {
  createServiceSchema,
  updateServiceSchema,
  serviceIdSchema,
  listServicesSchema,
} from './services.schema.js';

const router = Router();

/**
 * Public: get all active services (for citizens)
 * @swagger
 * /services/all:
 *   get:
 *     summary: Get all active services (public)
 *     tags: [Services]
 */
router.get('/all', optionalAuth, controller.getAllServices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get service details (accessible to authenticated users)
 *     tags: [Services]
 */
router.get('/:id', authenticate, validate(serviceIdSchema), controller.getService);

// Admin-only routes
router.use(authenticate, authorize(Role.ADMIN));

router
  .route('/')
  .get(validate(listServicesSchema), controller.listServices)
  .post(validate(createServiceSchema), controller.createService);

router
  .route('/:id')
  .put(validate(updateServiceSchema), controller.updateService)
  .delete(validate(serviceIdSchema), controller.deleteService);

export default router;
