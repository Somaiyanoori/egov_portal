import {
  Prisma,
  Request as RequestModel,
  RequestStatus,
  PaymentStatus,
  Role,
  NotificationType,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { CloudinaryService, isCloudinaryConfigured } from '../../config/cloudinary.js';
import { logger } from '../../config/logger.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../utils/AppError.js';
import { getPaginationMeta, getPrismaSkipTake, PaginationMeta } from '../../utils/pagination.js';
import type {
  CreateRequestInput,
  ProcessRequestInput,
  ListRequestsInput,
} from './requests.schema.js';

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

export class RequestsService {
  /**
   * Create a new request (transactional with documents + payment)
   */
  static async create(
    citizenId: string,
    data: CreateRequestInput,
    files: Express.Multer.File[],
  ): Promise<RequestModel> {
    // Verify service exists and is active
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { department: true },
    });

    if (!service) throw new NotFoundError('Service not found');
    if (!service.isActive) throw new BadRequestError('This service is currently unavailable');

    // Upload documents to Cloudinary (before transaction)
    const uploadedDocs: Array<{
      fileName: string;
      originalName: string;
      fileUrl: string;
      publicId: string | null;
      fileSize: number;
      mimeType: string;
    }> = [];

    if (files && files.length > 0) {
      if (!isCloudinaryConfigured) {
        throw new BadRequestError(
          'File upload is not configured. Please contact the administrator.',
        );
      }

      for (const file of files) {
        try {
          const result = await CloudinaryService.uploadBuffer(file.buffer, {
            folder: `egov-portal/requests/${citizenId}`,
            filename: `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`,
            resourceType: file.mimetype === 'application/pdf' ? 'raw' : 'auto',
          });

          uploadedDocs.push({
            fileName: result.publicId.split('/').pop() || file.originalname,
            originalName: file.originalname,
            fileUrl: result.url,
            publicId: result.publicId,
            fileSize: result.size,
            mimeType: file.mimetype,
          });
        } catch (error) {
          logger.error('Failed to upload file:', error);
          // Rollback previously uploaded files
          for (const doc of uploadedDocs) {
            if (doc.publicId) {
              await CloudinaryService.delete(doc.publicId).catch(() => {});
            }
          }
          throw new BadRequestError(`Failed to upload ${file.originalname}`);
        }
      }
    }

    // Create request + documents + payment in a transaction
    try {
      const request = await prisma.$transaction(async (tx) => {
        // Create request
        const newRequest = await tx.request.create({
          data: {
            citizenId,
            serviceId: data.serviceId,
            notes: data.notes,
            status: RequestStatus.SUBMITTED,
          },
        });

        // Create documents
        if (uploadedDocs.length > 0) {
          await tx.document.createMany({
            data: uploadedDocs.map((doc) => ({
              ...doc,
              requestId: newRequest.id,
            })),
          });
        }

        // Create payment record if service has a fee
        const fee = Number(service.fee);
        if (fee > 0) {
          await tx.payment.create({
            data: {
              requestId: newRequest.id,
              amount: fee,
              status: PaymentStatus.SUCCESS, // Simulated payment
              transactionId: `SIM_${Date.now()}_${newRequest.id.slice(-6)}`,
              paymentMethod: 'simulated',
              paidAt: new Date(),
            },
          });
        }

        // Create notification for the citizen
        await tx.notification.create({
          data: {
            userId: citizenId,
            type: NotificationType.REQUEST_UPDATE,
            title: 'Request Submitted',
            message: `Your request for "${service.name}" has been submitted successfully. Tracking number: ${newRequest.trackingNumber}`,
            link: `/app/requests/${newRequest.id}`,
          },
        });

        // Notify department officers (find them and notify)
        const officers = await tx.user.findMany({
          where: {
            departmentId: service.departmentId,
            role: { in: [Role.OFFICER, Role.HEAD] },
            isActive: true,
          },
          select: { id: true },
        });

        if (officers.length > 0) {
          await tx.notification.createMany({
            data: officers.map((officer) => ({
              userId: officer.id,
              type: NotificationType.INFO,
              title: 'New Request Received',
              message: `A new request for "${service.name}" has been submitted.`,
              link: `/app/requests/${newRequest.id}`,
            })),
          });
        }

        // Audit log
        await tx.auditLog.create({
          data: {
            action: 'REQUEST_CREATED',
            entityType: 'Request',
            entityId: newRequest.id,
            userId: citizenId,
            newValue: { serviceId: data.serviceId, trackingNumber: newRequest.trackingNumber },
          },
        });

        return newRequest;
      });

      // Fetch complete request with all relations
      const completeRequest = await prisma.request.findUnique({
        where: { id: request.id },
        include: requestInclude,
      });

      return completeRequest!;
    } catch (error) {
      // If transaction fails, delete uploaded files
      for (const doc of uploadedDocs) {
        if (doc.publicId) {
          await CloudinaryService.delete(doc.publicId).catch(() => {});
        }
      }
      throw error;
    }
  }

  /**
   * List requests (scoped by user role)
   */
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

    // Role-based filtering
    if (user.role === Role.CITIZEN) {
      where.citizenId = user.id;
    } else if (user.role === Role.OFFICER || user.role === Role.HEAD) {
      if (!user.departmentId) {
        throw new ForbiddenError('You are not assigned to a department');
      }
      where.service = { departmentId: user.departmentId };
    }
    // ADMIN can see all

    // Search by tracking number, citizen name, or service name
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

    // Only admin can filter by any citizen
    if (citizenId && user.role === Role.ADMIN) where.citizenId = citizenId;

    // Only admin can filter by any department
    if (departmentId && user.role === Role.ADMIN) {
      where.service = { departmentId };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1); // Include full end day
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

  /**
   * Get single request (with authorization check)
   */
  static async getById(
    id: string,
    user: { id: string; role: Role; departmentId?: string | null },
  ): Promise<RequestModel> {
    const request = await prisma.request.findUnique({
      where: { id },
      include: requestInclude,
    });

    if (!request) throw new NotFoundError('Request not found');

    // Authorization check
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

  /**
   * Process request (approve/reject/under_review)
   */
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

    // Verify officer belongs to the service's department
    if (
      (processor.role === Role.OFFICER || processor.role === Role.HEAD) &&
      request.service.departmentId !== processor.departmentId
    ) {
      throw new ForbiddenError('You cannot process requests from other departments');
    }

    // Prevent processing terminal states
    if (request.status === RequestStatus.APPROVED || request.status === RequestStatus.REJECTED) {
      throw new BadRequestError(
        `Request is already ${request.status.toLowerCase()} and cannot be changed`,
      );
    }

    const statusEnum = RequestStatus[data.status as keyof typeof RequestStatus];

    const updated = await prisma.$transaction(async (tx) => {
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

      // Notify citizen
      const statusMessages: Record<
        string,
        { title: string; message: string; type: NotificationType }
      > = {
        APPROVED: {
          title: '✅ Request Approved',
          message: `Your request for "${request.service.name}" (${request.trackingNumber}) has been approved!`,
          type: NotificationType.SUCCESS,
        },
        REJECTED: {
          title: '❌ Request Rejected',
          message: `Your request for "${request.service.name}" (${request.trackingNumber}) has been rejected. Reason: ${data.rejectionReason}`,
          type: NotificationType.ERROR,
        },
        UNDER_REVIEW: {
          title: '👀 Request Under Review',
          message: `Your request for "${request.service.name}" (${request.trackingNumber}) is now under review.`,
          type: NotificationType.INFO,
        },
      };

      const notif = statusMessages[data.status];
      if (notif) {
        await tx.notification.create({
          data: {
            userId: request.citizenId,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            link: `/app/requests/${id}`,
          },
        });
      }

      // Audit log
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

      return updatedRequest;
    });

    return updated;
  }

  /**
   * Cancel request (citizen only, if not yet approved/rejected)
   */
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

  /**
   * Get request stats for user
   */
  static async getMyStats(userId: string): Promise<{
    total: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
    cancelled: number;
  }> {
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
      const key = g.status.toLowerCase().replace('_', '') as keyof typeof stats;
      const count = g._count as number;
      if (g.status === 'UNDER_REVIEW') stats.underReview = count;
      else if (key in stats) (stats as any)[key] = count;
      stats.total += count;
    });

    return stats;
  }
}
