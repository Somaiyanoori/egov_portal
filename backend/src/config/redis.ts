import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

class RedisClient {
  private static instance: Redis;

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
      });

      RedisClient.instance.on('connect', () => {
        logger.info('✅ Redis connected successfully');
      });

      RedisClient.instance.on('error', (err) => {
        logger.error('❌ Redis error:', err.message);
      });

      RedisClient.instance.on('close', () => {
        logger.warn('⚠️  Redis connection closed');
      });

      RedisClient.instance.on('reconnecting', () => {
        logger.info('🔄 Redis reconnecting...');
      });
    }

    return RedisClient.instance;
  }

  public static async disconnect(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
      logger.info('👋 Redis disconnected');
    }
  }
}

export const redis = RedisClient.getInstance();
export default RedisClient;
