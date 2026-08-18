import { Department, Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../utils/AppError.js';
import { getPaginationMeta, getPrismaSkipTake, PaginationMeta } from '../../utils/pagination.js';
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  ListDepartmentsInput,
} from './departments.schema.js';

export class DepartmentsService {
  static async create(data: CreateDepartmentInput, actorId: string): Promise<Department> {
    const existing = await prisma.department.findUnique({ where: { name: data.name } });
    if (existing) throw new ConflictError('Department name already exists');

    if (data.code) {
      const codeExists = await prisma.department.findUnique({ where: { code: data.code } });
      if (codeExists) throw new ConflictError('Department code already exists');
    }

    const department = await prisma.department.create({ data });

    await prisma.auditLog.create({
      data: {
        action: 'DEPARTMENT_CREATED',
        entityType: 'Department',
        entityId: department.id,
        userId: actorId,
        newValue: { name: department.name },
      },
    });

    return department;
  }

  static async list(
    params: ListDepartmentsInput,
  ): Promise<{
    departments: Array<Department & { _count: { users: number; services: number } }>;
    meta: PaginationMeta;
  }> {
    const { page, limit, sortBy, sortOrder, search, isActive } = params;

    const where: Prisma.DepartmentWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameFa: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) where.isActive = isActive;

    const orderBy: Prisma.DepartmentOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder }
      : { name: 'asc' };

    const { skip, take } = getPrismaSkipTake(page, limit);

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        include: {
          _count: {
            select: { users: true, services: true },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.department.count({ where }),
    ]);

    return {
      departments,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getAll(): Promise<Department[]> {
    return prisma.department.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  static async getById(
    id: string,
  ): Promise<Department & { _count: { users: number; services: number } }> {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true, services: true } },
      },
    });

    if (!department) throw new NotFoundError('Department not found');
    return department;
  }

  static async update(
    id: string,
    data: UpdateDepartmentInput,
    actorId: string,
  ): Promise<Department> {
    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Department not found');

    if (data.name && data.name !== existing.name) {
      const nameTaken = await prisma.department.findUnique({ where: { name: data.name } });
      if (nameTaken) throw new ConflictError('Department name already exists');
    }

    if (data.code && data.code !== existing.code) {
      const codeTaken = await prisma.department.findUnique({ where: { code: data.code } });
      if (codeTaken) throw new ConflictError('Department code already exists');
    }

    const department = await prisma.department.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        action: 'DEPARTMENT_UPDATED',
        entityType: 'Department',
        entityId: id,
        userId: actorId,
        oldValue: { name: existing.name },
        newValue: data as Prisma.InputJsonValue,
      },
    });

    return department;
  }

  static async delete(id: string, actorId: string): Promise<void> {
    const dept = await prisma.department.findUnique({
      where: { id },
      include: { _count: { select: { users: true, services: true } } },
    });

    if (!dept) throw new NotFoundError('Department not found');

    if (dept._count.users > 0) {
      throw new BadRequestError(
        `Cannot delete department. ${dept._count.users} user(s) are assigned to it.`,
      );
    }

    if (dept._count.services > 0) {
      throw new BadRequestError(
        `Cannot delete department. ${dept._count.services} service(s) belong to it.`,
      );
    }

    await prisma.department.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: 'DEPARTMENT_DELETED',
        entityType: 'Department',
        entityId: id,
        userId: actorId,
        oldValue: { name: dept.name },
      },
    });
  }
}
