import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

class RedisClient {
  private static instance: Redis;

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      const redisUrl = process.env.REDIS_URL;

      if (redisUrl) {
        // Cloud environment (e.g. Render Redis, Upstash, Redis Cloud)
        const isTls = redisUrl.startsWith('rediss://');

        RedisClient.instance = new Redis(redisUrl, {
          maxRetriesPerRequest: null, // Prevents 'max retries reached' error
          enableReadyCheck: false,
          tls: isTls ? { rejectUnauthorized: false } : undefined,
          retryStrategy(times) {
            return Math.min(times * 100, 3000);
          },
        });
      } else {
        // Local environment (Docker / Localhost)
        RedisClient.instance = new Redis({
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
          password: env.REDIS_PASSWORD || undefined,
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          retryStrategy(times) {
            return Math.min(times * 100, 3000);
          },
          reconnectOnError(err) {
            if (err.message.includes('READONLY')) {
              return true;
            }
            return false;
          },
        });
      }

      RedisClient.instance.on('connect', () => {
        logger.info('✅ Redis connected successfully');
      });

      RedisClient.instance.on('error', (err: Error) => {
        logger.error(`❌ Redis error: ${err.message || 'Unknown connection error'}`);
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
