import {
  Prisma,
  Request as RequestModel,
  RequestStatus,
  PaymentStatus,
  Role,
  NotificationType,
} from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../../config/database.js';
import { CloudinaryService, isCloudinaryConfigured } from '../../config/cloudinary.js';
import { socketService } from '../../config/socket.js';
import { logger } from '../../config/logger.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../utils/AppError.js';
import { getPaginationMeta, getPrismaSkipTake, PaginationMeta } from '../../utils/pagination.js';
import type {
  CreateRequestInput,
  ProcessRequestInput,
  ListRequestsInput,
} from './requests.schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, '../../../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const requestInclude = {
  citizen: {
    select: { id: true, name: true, email: true, phone: true, nationalId: true },
  },
  service: {
    select: {
      id: true,
      name: true,
      nameFa: true,
      fee: true,
      processingDays: true,
      department: {
        select: { id: true, name: true, nameFa: true },
      },
    },
  },
  processedBy: {
    select: { id: true, name: true, email: true, jobTitle: true },
  },
  documents: true,
  payment: true,
} satisfies Prisma.RequestInclude;

async function emitNotification(userId: string, notification: unknown) {
  try {
    socketService.emitToUser(userId, 'notification:new', notification);
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    socketService.emitToUser(userId, 'notification:count', { unreadCount });
  } catch (err) {
    logger.warn('Failed to emit socket notification:', err);
  }
}

export class RequestsService {
  static async create(
    citizenId: string,
    data: CreateRequestInput,
    files: Express.Multer.File[],
  ): Promise<RequestModel> {
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { department: true },
    });

    if (!service) throw new NotFoundError('Service not found');
    if (!service.isActive) throw new BadRequestError('This service is currently unavailable');

    const uploadedDocs: Array<{
      fileName: string;
      originalName: string;
      fileUrl: string;
      publicId: string | null;
      fileSize: number;
      mimeType: string;
    }> = [];

    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const cleanName = file.originalname.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${cleanName}`;

          if (isCloudinaryConfigured) {
            const result = await CloudinaryService.uploadBuffer(file.buffer, {
              folder: `egov-portal/requests/${citizenId}`,
              filename: uniqueName,
              resourceType: file.mimetype === 'application/pdf' ? 'raw' : 'auto',
            });
            uploadedDocs.push({
              fileName: result.publicId.split('/').pop() || cleanName,
              originalName: file.originalname,
              fileUrl: result.url,
              publicId: result.publicId,
              fileSize: result.size,
              mimeType: file.mimetype,
            });
          } else {
            const diskPath = path.join(UPLOAD_DIR, uniqueName);
            fs.writeFileSync(diskPath, file.buffer);
            uploadedDocs.push({
              fileName: uniqueName,
              originalName: file.originalname,
              fileUrl: `/uploads/${uniqueName}`,
              publicId: null,
              fileSize: file.size,
              mimeType: file.mimetype,
            });
          }
        } catch (error) {
          logger.error(`Failed to save file ${file.originalname}:`, error);
          for (const doc of uploadedDocs) {
            if (!doc.publicId && doc.fileName) {
              const p = path.join(UPLOAD_DIR, doc.fileName);
              if (fs.existsSync(p)) fs.unlinkSync(p);
            }
            if (doc.publicId) {
              await CloudinaryService.delete(doc.publicId).catch(() => {});
            }
          }
          throw new BadRequestError(`Failed to upload ${file.originalname}`);
        }
      }
    }

    try {
      const { request, citizenNotif, officerNotifs } = await prisma.$transaction(async (tx) => {
        const newRequest = await tx.request.create({
          data: {
            citizenId,
            serviceId: data.serviceId,
            notes: data.notes,
            status: RequestStatus.SUBMITTED,
          },
        });

        if (uploadedDocs.length > 0) {
          await tx.document.createMany({
            data: uploadedDocs.map((doc) => ({
              ...doc,
              requestId: newRequest.id,
            })),
          });
        }

        const fee = Number(service.fee);
        if (fee > 0) {
          await tx.payment.create({
            data: {
              requestId: newRequest.id,
              amount: fee,
              status: PaymentStatus.SUCCESS,
              transactionId: `SIM_${Date.now()}_${newRequest.id.slice(-6)}`,
              paymentMethod: 'simulated',
              paidAt: new Date(),
            },
          });
        }

        const citizenNotif = await tx.notification.create({
          data: {
            userId: citizenId,
            type: NotificationType.REQUEST_UPDATE,
            title: 'Request Submitted',
            message: `Your request for "${service.name}" was submitted. Tracking: ${newRequest.trackingNumber}`,
            link: `/app/requests/${newRequest.id}`,
          },
        });

        const officers = await tx.user.findMany({
          where: {
            departmentId: service.departmentId,
            role: { in: [Role.OFFICER, Role.HEAD] },
            isActive: true,
          },
          select: { id: true },
        });

        const admins = await tx.user.findMany({
          where: { role: Role.ADMIN, isActive: true },
          select: { id: true },
        });

        const recipientIds = [
          ...new Set([...officers.map((o) => o.id), ...admins.map((a) => a.id)]),
        ];

        const officerNotifs =
          recipientIds.length > 0
            ? await Promise.all(
                recipientIds.map((uid) =>
                  tx.notification.create({
                    data: {
                      userId: uid,
                      type: NotificationType.INFO,
                      title: 'New Request Received',
                      message: `New request for "${service.name}" from a citizen. Tracking: ${newRequest.trackingNumber}`,
                      link: `/app/requests/${newRequest.id}`,
                    },
                  }),
                ),
              )
            : [];

        await tx.auditLog.create({
          data: {
            action: 'REQUEST_CREATED',
            entityType: 'Request',
            entityId: newRequest.id,
            userId: citizenId,
            newValue: {
              serviceId: data.serviceId,
              trackingNumber: newRequest.trackingNumber,
              filesUploaded: uploadedDocs.length,
            },
          },
        });

        return { request: newRequest, citizenNotif, officerNotifs };
      });

      await emitNotification(citizenId, citizenNotif);
      for (const n of officerNotifs) {
        await emitNotification(n.userId, n);
      }

      const completeRequest = await prisma.request.findUnique({
        where: { id: request.id },
        include: requestInclude,
      });

      return completeRequest!;
    } catch (error) {
      for (const doc of uploadedDocs) {
        if (doc.publicId) {
          await CloudinaryService.delete(doc.publicId).catch(() => {});
        } else if (doc.fileName) {
          const p = path.join(UPLOAD_DIR, doc.fileName);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        }
      }
      throw error;
    }
  }

  static async list(
    user: { id: string; role: Role; departmentId?: string | null },
    params: ListRequestsInput,
  ): Promise<{ requests: RequestModel[]; meta: PaginationMeta }> {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      status,
      serviceId,
      citizenId,
      departmentId,
      startDate,
      endDate,
    } = params;

    const where: Prisma.RequestWhereInput = {};

    if (user.role === Role.CITIZEN) {
      where.citizenId = user.id;
    } else if (user.role === Role.OFFICER || user.role === Role.HEAD) {
      if (!user.departmentId) {
        throw new ForbiddenError('You are not assigned to a department');
      }
      where.service = { departmentId: user.departmentId };
    }

    if (search) {
      where.OR = [
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { citizen: { name: { contains: search, mode: 'insensitive' } } },
        { citizen: { email: { contains: search, mode: 'insensitive' } } },
        { service: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) where.status = status;
    if (serviceId) where.serviceId = serviceId;
    if (citizenId && user.role === Role.ADMIN) where.citizenId = citizenId;
    if (departmentId && user.role === Role.ADMIN) {
      where.service = { departmentId };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        where.createdAt.lt = end;
      }
    }

    const orderBy: Prisma.RequestOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder }
      : { createdAt: sortOrder };

    const { skip, take } = getPrismaSkipTake(page, limit);

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        include: requestInclude,
        orderBy,
        skip,
        take,
      }),
      prisma.request.count({ where }),
    ]);

    return {
      requests,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getById(
    id: string,
    user: { id: string; role: Role; departmentId?: string | null },
  ): Promise<RequestModel> {
    const request = await prisma.request.findUnique({
      where: { id },
      include: requestInclude,
    });

    if (!request) throw new NotFoundError('Request not found');

    const isOwner = request.citizenId === user.id;
    const isAdmin = user.role === Role.ADMIN;
    const isDepartmentOfficer =
      (user.role === Role.OFFICER || user.role === Role.HEAD) &&
      (request as any).service.department.id === user.departmentId;

    if (!isOwner && !isAdmin && !isDepartmentOfficer) {
      throw new ForbiddenError('You do not have permission to view this request');
    }

    return request;
  }

  static async process(
    id: string,
    data: ProcessRequestInput,
    processor: { id: string; role: Role; departmentId?: string | null },
  ): Promise<RequestModel> {
    const request = await prisma.request.findUnique({
      where: { id },
      include: { service: { include: { department: true } }, citizen: true },
    });

    if (!request) throw new NotFoundError('Request not found');

    if (
      (processor.role === Role.OFFICER || processor.role === Role.HEAD) &&
      request.service.departmentId !== processor.departmentId
    ) {
      throw new ForbiddenError('You cannot process requests from other departments');
    }

    if (request.status === RequestStatus.APPROVED || request.status === RequestStatus.REJECTED) {
      throw new BadRequestError(
        `Request is already ${request.status.toLowerCase()} and cannot be changed`,
      );
    }

    const statusEnum = RequestStatus[data.status as keyof typeof RequestStatus];

    const { updatedRequest, notif } = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.request.update({
        where: { id },
        data: {
          status: statusEnum,
          rejectionReason: data.status === 'REJECTED' ? data.rejectionReason : null,
          processedById: processor.id,
          processedAt: data.status !== 'UNDER_REVIEW' ? new Date() : undefined,
        },
        include: requestInclude,
      });

      const statusMessages: Record<
        string,
        { title: string; message: string; type: NotificationType }
      > = {
        APPROVED: {
          title: 'Request Approved',
          message: `Your request for "${request.service.name}" (${request.trackingNumber}) has been approved!`,
          type: NotificationType.SUCCESS,
        },
        REJECTED: {
          title: 'Request Rejected',
          message: `Your request for "${request.service.name}" (${request.trackingNumber}) has been rejected. Reason: ${data.rejectionReason}`,
          type: NotificationType.ERROR,
        },
        UNDER_REVIEW: {
          title: 'Request Under Review',
          message: `Your request for "${request.service.name}" (${request.trackingNumber}) is now under review.`,
          type: NotificationType.INFO,
        },
      };

      const msg = statusMessages[data.status];
      const notif = await tx.notification.create({
        data: {
          userId: request.citizenId,
          type: msg.type,
          title: msg.title,
          message: msg.message,
          link: `/app/requests/${id}`,
        },
      });

      await tx.auditLog.create({
        data: {
          action: `REQUEST_${data.status}`,
          entityType: 'Request',
          entityId: id,
          userId: processor.id,
          oldValue: { status: request.status },
          newValue: { status: data.status, rejectionReason: data.rejectionReason },
        },
      });

      return { updatedRequest, notif };
    });

    await emitNotification(request.citizenId, notif);

    return updatedRequest;
  }

  static async cancel(id: string, userId: string): Promise<RequestModel> {
    const request = await prisma.request.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!request) throw new NotFoundError('Request not found');
    if (request.citizenId !== userId) {
      throw new ForbiddenError('You can only cancel your own requests');
    }
    if (request.status === RequestStatus.APPROVED || request.status === RequestStatus.REJECTED) {
      throw new BadRequestError('Cannot cancel a request that has been processed');
    }

    const cancelled = await prisma.$transaction(async (tx) => {
      const updated = await tx.request.update({
        where: { id },
        data: { status: RequestStatus.CANCELLED, processedAt: new Date() },
        include: requestInclude,
      });

      await tx.notification.create({
        data: {
          userId,
          type: NotificationType.INFO,
          title: 'Request Cancelled',
          message: `You cancelled your request for "${request.service.name}"`,
          link: `/app/requests/${id}`,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'REQUEST_CANCELLED',
          entityType: 'Request',
          entityId: id,
          userId,
        },
      });

      return updated;
    });

    return cancelled;
  }

  static async getMyStats(userId: string) {
    const groups = await prisma.request.groupBy({
      by: ['status'],
      where: { citizenId: userId },
      _count: true,
    });

    const stats = {
      total: 0,
      submitted: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
    };

    groups.forEach((g) => {
      const count = g._count as number;
      if (g.status === 'UNDER_REVIEW') stats.underReview = count;
      else if (g.status === 'SUBMITTED') stats.submitted = count;
      else if (g.status === 'APPROVED') stats.approved = count;
      else if (g.status === 'REJECTED') stats.rejected = count;
      else if (g.status === 'CANCELLED') stats.cancelled = count;
      stats.total += count;
    });

    return stats;
  }
}
