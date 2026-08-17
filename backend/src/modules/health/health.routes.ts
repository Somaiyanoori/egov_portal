import { Router } from 'express';
import { healthCheck, detailedHealth } from './health.controller.js';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get('/', healthCheck);

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check with all services
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 */
router.get('/detailed', detailedHealth);

export default router;
