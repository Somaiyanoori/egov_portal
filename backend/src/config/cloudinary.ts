import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { logger } from './logger.js';

const isConfigured = !!(
  env.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET &&
  env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  logger.info('✅ Cloudinary configured');
} else {
  logger.warn('⚠️  Cloudinary NOT configured. File uploads will use local fallback.');
}

export { cloudinary, isConfigured as isCloudinaryConfigured };

export interface UploadResult {
  url: string;
  publicId: string;
  size: number;
  format: string;
  resourceType: string;
}

export class CloudinaryService {
  static async uploadBuffer(
    buffer: Buffer,
    options: {
      folder?: string;
      filename?: string;
      resourceType?: 'image' | 'raw' | 'auto';
    } = {},
  ): Promise<UploadResult> {
    if (!isConfigured) {
      throw new Error('Cloudinary is not configured');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'egov-portal',
          public_id: options.filename,
          resource_type: options.resourceType || 'auto',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            size: result.bytes,
            format: result.format,
            resourceType: result.resource_type,
          });
        },
      );

      uploadStream.end(buffer);
    });
  }

  static async delete(publicId: string, resourceType = 'image'): Promise<void> {
    if (!isConfigured) return;
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      logger.error(`Failed to delete from Cloudinary (${publicId}):`, error);
    }
  }

  static async deleteMultiple(publicIds: string[]): Promise<void> {
    if (!isConfigured || publicIds.length === 0) return;
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      logger.error('Failed to delete multiple from Cloudinary:', error);
    }
  }
}
