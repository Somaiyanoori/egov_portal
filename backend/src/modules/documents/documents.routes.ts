import { Router } from 'express';
import * as controller from './documents.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get document details
 *     tags: [Documents]
 *     security:
 *       - cookieAuth: []
 *   delete:
 *     summary: Delete document (owner only)
 *     tags: [Documents]
 *     security:
 *       - cookieAuth: []
 */
router.get('/:id', controller.getDocument);
router.delete('/:id', controller.deleteDocument);

export default router;
