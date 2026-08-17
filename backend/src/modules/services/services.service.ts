import { Prisma, Service } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { NotFoundError, BadRequestError } from '../../utils/AppError.js';
import { getPaginationMeta, getPrismaSkipTake, PaginationMeta } from '../../utils/pagination.js';
import type {
  CreateServiceInput,
  UpdateServiceInput,
  ListServicesInput,
} from './services.schema.js';

const serviceInclude = {
  department: {
    select: { id: true, name: true, nameFa: true, code: true },
  },
  _count: {
    select: { requests: true },
  },
} satisfies Prisma.ServiceInclude;

export class ServicesService {
  static async create(data: CreateServiceInput, actorId: string): Promise<Service> {
    // Verify department exists
    const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!dept) throw new BadRequestError('Invalid department ID');

    const service = await prisma.service.create({
      data: {
        ...data,
        requiredDocuments: data.requiredDocuments as Prisma.InputJsonValue,
      },
      include: serviceInclude,
    });

    await prisma.auditLog.create({
      data: {
        action: 'SERVICE_CREATED',
        entityType: 'Service',
        entityId: service.id,
        userId: actorId,
        newValue: { name: service.name, departmentId: service.departmentId },
      },
    });

    return service;
  }

  static async list(params: ListServicesInput): Promise<{
    services: Array<Service & { department: { id: string; name: string } }>;
    meta: PaginationMeta;
  }> {
    const { page, limit, sortBy, sortOrder, search, departmentId, isActive, minFee, maxFee } =
      params;

    const where: Prisma.ServiceWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameFa: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (departmentId) where.departmentId = departmentId;
    if (isActive !== undefined) where.isActive = isActive;

    if (minFee !== undefined || maxFee !== undefined) {
      where.fee = {};
      if (minFee !== undefined) where.fee.gte = minFee;
      if (maxFee !== undefined) where.fee.lte = maxFee;
    }

    const orderBy: Prisma.ServiceOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder }
      : { createdAt: 'desc' };

    const { skip, take } = getPrismaSkipTake(page, limit);

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: serviceInclude,
        orderBy,
        skip,
        take,
      }),
      prisma.service.count({ where }),
    ]);

    return {
      services: services as any,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getAll(): Promise<Service[]> {
    return prisma.service.findMany({
      where: { isActive: true },
      include: serviceInclude,
      orderBy: [{ department: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  static async getById(id: string): Promise<Service> {
    const service = await prisma.service.findUnique({
      where: { id },
      include: serviceInclude,
    });

    if (!service) throw new NotFoundError('Service not found');
    return service;
  }

  static async update(id: string, data: UpdateServiceInput, actorId: string): Promise<Service> {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Service not found');

    if (data.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });
      if (!dept) throw new BadRequestError('Invalid department ID');
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...data,
        requiredDocuments: data.requiredDocuments as Prisma.InputJsonValue,
      },
      include: serviceInclude,
    });

    await prisma.auditLog.create({
      data: {
        action: 'SERVICE_UPDATED',
        entityType: 'Service',
        entityId: id,
        userId: actorId,
        oldValue: { name: existing.name },
        newValue: data as Prisma.InputJsonValue,
      },
    });

    return service;
  }

  static async delete(id: string, actorId: string): Promise<void> {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { _count: { select: { requests: true } } },
    });

    if (!service) throw new NotFoundError('Service not found');

    if (service._count.requests > 0) {
      throw new BadRequestError(
        `Cannot delete service. ${service._count.requests} request(s) are linked to it. Deactivate it instead.`,
      );
    }

    await prisma.service.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: 'SERVICE_DELETED',
        entityType: 'Service',
        entityId: id,
        userId: actorId,
        oldValue: { name: service.name },
      },
    });
  }
}
