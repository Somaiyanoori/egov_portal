import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';
import { isDevelopment } from '../config/env.js';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
  requestId?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown = undefined;

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    requestId: req.requestId,
  });

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }
  // Handle Prisma errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        statusCode = 409;
        const field = (err.meta?.target as string[])?.[0] || 'field';
        message = `A record with this ${field} already exists`;
        break;
      }
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint failed';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'Invalid ID provided';
        break;
      default:
        statusCode = 500;
        message = 'Database error';
    }
  }
  // Handle Prisma validation errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  }
  // Handle other known errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'SyntaxError' && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }

  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (req.requestId) {
    response.requestId = req.requestId;
  }

  // Include stack trace in development
  if (isDevelopment && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
