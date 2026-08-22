import express, { Application } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import requestsRoutes from './modules/requests/requests.routes.js';
import documentsRoutes from './modules/documents/documents.routes.js';
import { env, isDevelopment } from './config/env.js';
import { stream } from './config/logger.js';
import { swaggerSpec } from './config/swagger.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { requestId } from './middleware/requestLogger.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import usersRoutes from './modules/users/users.routes.js';
import departmentsRoutes from './modules/departments/departments.routes.js';
import servicesRoutes from './modules/services/services.routes.js';
import healthRoutes from './modules/health/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createApp = (): Application => {
  const app = express();

  // Trust proxy (needed for rate limiting behind reverse proxies)
  app.set('trust proxy', 1);

  // Request ID
  app.use(requestId);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: isDevelopment ? false : undefined,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: env.CORS_CREDENTIALS,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
      exposedHeaders: ['X-Request-Id'],
    }),
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser
  app.use(cookieParser(env.COOKIE_SECRET));

  // Compression
  app.use(compression());

  // Prevent HTTP parameter pollution
  app.use(hpp());

  // Data sanitization against NoSQL injection
  app.use(mongoSanitize());

  // HTTP request logging
  app.use(morgan(isDevelopment ? 'dev' : 'combined', { stream }));
  // Serve locally uploaded documents
  app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
  // API Documentation
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'E-Gov Portal API Docs',
    }),
  );

  // Swagger JSON
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Root route
  app.get('/', (_req, res) => {
    res.json({
      name: 'E-Government Portal API',
      version: '1.0.0',
      status: 'running',
      environment: env.NODE_ENV,
      documentation: `/api/docs`,
      health: `${env.API_PREFIX}/health`,
    });
  });

  // Rate limiting (applied to all /api routes)
  app.use(env.API_PREFIX, apiLimiter);

  // Health check routes (no rate limit needed)
  app.use(`${env.API_PREFIX}/health`, healthRoutes);
  // Auth routes
  app.use(`${env.API_PREFIX}/auth`, authRoutes);

  // Users routes (admin)
  app.use(`${env.API_PREFIX}/users`, usersRoutes);

  // Departments routes
  app.use(`${env.API_PREFIX}/departments`, departmentsRoutes);

  // Services routes
  app.use(`${env.API_PREFIX}/services`, servicesRoutes);

  // Requests routes
  app.use(`${env.API_PREFIX}/requests`, requestsRoutes);

  // Documents routes
  app.use(`${env.API_PREFIX}/documents`, documentsRoutes);

  // Notifications routes
  app.use(`${env.API_PREFIX}/notifications`, notificationsRoutes);

  // Reports routes
  app.use(`${env.API_PREFIX}/reports`, reportsRoutes);

  // Silence favicon requests
  app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
  });

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (MUST be last)
  app.use(errorHandler);

  return app;
};

export default createApp;
