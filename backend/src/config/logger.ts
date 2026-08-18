import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { env, isDevelopment } from './env.js';

const { combine, timestamp, printf, colorize, errors, json, splat } = winston.format;

// Custom log format for console
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
  const stackStr = stack ? `\n${stack}` : '';
  return `${timestamp} [${level}]: ${message}${metaStr}${stackStr}`;
});

// Custom log levels with colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'gray',
};

winston.addColors(colors);

// Create the logger
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    splat(),
    json(),
  ),
  defaultMeta: { service: 'egov-api' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'HH:mm:ss' }),
        errors({ stack: true }),
        consoleFormat,
      ),
    }),
  ],
  exitOnError: false,
});

// Add file transports in production
if (!isDevelopment) {
  const logDir = path.resolve(env.LOG_DIR);

  logger.add(
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      zippedArchive: true,
    }),
  );

  logger.add(
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  );
}

// Stream for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
