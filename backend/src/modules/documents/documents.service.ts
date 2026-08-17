import { prisma } from '../../config/database.js';
import { Role } from '@prisma/client';
import { CloudinaryService } from '../../config/cloudinary.js';
import { NotFoundError, ForbiddenError } from '../../utils/AppError.js';

export class DocumentsService {
  /**
   * Get document by ID (with authorization)
   */
  static async getById(
    documentId: string,
    user: { id: string; role: Role; departmentId?: string | null },
  ) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        request: {
          include: {
            service: { include: { department: true } },
          },
        },
      },
    });

    if (!document) throw new NotFoundError('Document not found');

    // Authorization
    const isOwner = document.request.citizenId === user.id;
    const isAdmin = user.role === Role.ADMIN;
    const isDeptOfficer =
      (user.role === Role.OFFICER || user.role === Role.HEAD) &&
      document.request.service.departmentId === user.departmentId;

    if (!isOwner && !isAdmin && !isDeptOfficer) {
      throw new ForbiddenError('You do not have permission to view this document');
    }

    return document;
  }

  /**
   * Delete document (citizen owner only, and only if request not yet processed)
   */
  static async delete(documentId: string, userId: string): Promise<void> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { request: true },
    });

    if (!document) throw new NotFoundError('Document not found');
    if (document.request.citizenId !== userId) {
      throw new ForbiddenError('You can only delete your own documents');
    }

    if (['APPROVED', 'REJECTED'].includes(document.request.status)) {
      throw new ForbiddenError('Cannot delete documents from processed requests');
    }

    // Delete from Cloudinary
    if (document.publicId) {
      await CloudinaryService.delete(document.publicId);
    }

    await prisma.document.delete({ where: { id: documentId } });
  }
}
