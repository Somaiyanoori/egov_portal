import { createServer } from 'http';
import createApp from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import Database from './config/database.js';
import RedisClient from './config/redis.js';
import { socketService } from './config/socket.js';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await Database.connect();

    // Connect to Redis
    RedisClient.getInstance();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    socketService.initialize(httpServer);

    // Start listening
    httpServer.listen(env.PORT, () => {
      const banner = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║          🚀  E-GOV PORTAL API v1.0.0  🚀                 ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║   Environment : ${env.NODE_ENV.padEnd(40)} ║
║   Port        : ${String(env.PORT).padEnd(40)} ║
║   API         : http://localhost:${env.PORT}${env.API_PREFIX.padEnd(20)} ║
║   Docs        : http://localhost:${env.PORT}/api/docs${' '.repeat(13)} ║
║   Health      : http://localhost:${env.PORT}${env.API_PREFIX}/health${' '.repeat(6)} ║
║   Socket.io   : ws://localhost:${env.PORT}${' '.repeat(22)} ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
      `;
      logger.info(banner);
      logger.info(`✅ Server ready and listening on port ${env.PORT}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`\n📡 ${signal} received, starting graceful shutdown...`);

      httpServer.close(async () => {
        logger.info('🔌 HTTP server closed');

        try {
          await Database.disconnect();
          await RedisClient.disconnect();
          logger.info('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      setTimeout(() => {
        logger.error('⏱️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      logger.error('💥 Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('💥 Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
