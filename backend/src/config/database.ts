import { PrismaClient, Prisma } from '@prisma/client';
import { env, isDevelopment } from './env.js';
import { logger } from './logger.js';

const prismaLogOptions: Prisma.PrismaClientOptions = {
  log: isDevelopment
    ? [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ]
    : [{ emit: 'event', level: 'error' }],
  errorFormat: isDevelopment ? 'pretty' : 'minimal',
};

class Database {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient(prismaLogOptions);

      // Log slow queries in development
      if (isDevelopment) {
        (Database.instance.$on as any)('query', (e: Prisma.QueryEvent) => {
          if (e.duration > 100) {
            logger.warn(`🐢 Slow query (${e.duration}ms): ${e.query}`);
          }
        });
      }

      (Database.instance.$on as any)('error', (e: Prisma.LogEvent) => {
        logger.error('Prisma Error:', e);
      });
    }

    return Database.instance;
  }

  public static async connect(): Promise<void> {
    try {
      const prisma = Database.getInstance();
      await prisma.$connect();
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (Database.instance) {
      await Database.instance.$disconnect();
      logger.info('👋 Database disconnected');
    }
  }
}

export const prisma = Database.getInstance();
export default Database;
