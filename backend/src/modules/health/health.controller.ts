import { Request, Response } from 'express';
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { env } from '../../config/env.js';

export const healthCheck = asyncHandler(async (_req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  };

  return ApiResponse.success(res, health, 'Server is healthy');
});

export const detailedHealth = asyncHandler(async (_req: Request, res: Response) => {
  const startTime = Date.now();

  // Check database
  let dbStatus = 'ok';
  let dbLatency = 0;
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - dbStart;
  } catch {
    dbStatus = 'error';
  }

  // Check Redis
  let redisStatus = 'ok';
  let redisLatency = 0;
  try {
    const redisStart = Date.now();
    await redis.ping();
    redisLatency = Date.now() - redisStart;
  } catch {
    redisStatus = 'error';
  }

  const memoryUsage = process.memoryUsage();

  const health = {
    status: dbStatus === 'ok' && redisStatus === 'ok' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: '1.0.0',
    responseTime: `${Date.now() - startTime}ms`,
    services: {
      database: {
        status: dbStatus,
        latency: `${dbLatency}ms`,
      },
      redis: {
        status: redisStatus,
        latency: `${redisLatency}ms`,
      },
    },
    system: {
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      cpu: process.cpuUsage(),
      nodeVersion: process.version,
      platform: process.platform,
    },
  };

  return ApiResponse.success(res, health, 'Detailed health check');
});
