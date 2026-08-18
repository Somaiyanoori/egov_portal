import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env.js';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Government Portal API',
      version: '1.0.0',
      description: 'A modern REST API for E-Government Citizen Services Portal',
      contact: {
        name: 'API Support',
        email: 'support@egov-portal.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Departments', description: 'Department management' },
      { name: 'Services', description: 'Service management' },
      { name: 'Requests', description: 'Request management' },
      { name: 'Notifications', description: 'Notification management' },
      { name: 'Reports', description: 'Reports and analytics' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
