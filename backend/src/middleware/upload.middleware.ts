import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { env } from '../config/env.js';
import { BadRequestError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';

const allowedMimeTypes = env.ALLOWED_FILE_TYPES.split(',').map((t) => t.trim());

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  logger.info(`Upload attempt: ${file.originalname}, mime: ${file.mimetype}`);

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        `Invalid file type: ${file.mimetype}. Allowed: ${allowedMimeTypes.join(', ')}`,
      ),
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 10,
  },
});

export const uploadMultiple = (fieldName: string, maxCount = 5) =>
  upload.array(fieldName, maxCount);

export const uploadSingle = (fieldName: string) => upload.single(fieldName);
