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

  app.set('trust proxy', 1);
  app.use(requestId);

  app.use(
    helmet({
      contentSecurityPolicy: isDevelopment ? false : undefined,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
        // Allow requests with no origin (like mobile apps/curl), allowedOrigins, or any .vercel.app deployment
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          origin.endsWith('.vercel.app') ||
          isDevelopment
        ) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: env.CORS_CREDENTIALS,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
      exposedHeaders: ['X-Request-Id'],
    }),
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(compression());
  app.use(hpp());
  app.use(mongoSanitize());
  app.use(morgan(isDevelopment ? 'dev' : 'combined', { stream }));

  app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'E-Gov Portal API Docs',
    }),
  );

  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

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

  app.use(env.API_PREFIX, apiLimiter);
  app.use(`${env.API_PREFIX}/health`, healthRoutes);
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/users`, usersRoutes);
  app.use(`${env.API_PREFIX}/departments`, departmentsRoutes);
  app.use(`${env.API_PREFIX}/services`, servicesRoutes);
  app.use(`${env.API_PREFIX}/requests`, requestsRoutes);
  app.use(`${env.API_PREFIX}/documents`, documentsRoutes);
  app.use(`${env.API_PREFIX}/notifications`, notificationsRoutes);
  app.use(`${env.API_PREFIX}/reports`, reportsRoutes);

  app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
