import { Prisma, User } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { PasswordService } from '../../utils/password.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../utils/AppError.js';
import { getPaginationMeta, getPrismaSkipTake, PaginationMeta } from '../../utils/pagination.js';
import type { CreateUserInput, UpdateUserInput, ListUsersInput } from './users.schema.js';

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  nationalId: true,
  dateOfBirth: true,
  phone: true,
  avatar: true,
  jobTitle: true,
  isEmailVerified: true,
  isActive: true,
  lastLoginAt: true,
  departmentId: true,
  department: {
    select: { id: true, name: true, nameFa: true },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

type SafeUser = Omit<User, 'password' | 'emailVerifyToken' | 'passwordResetToken'>;

export class UsersService {
  /**
   * Create a new user (admin only)
   */
  static async create(data: CreateUserInput, actorId: string): Promise<SafeUser> {
    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictError('Email already in use');

    // Check nationalId if provided
    if (data.nationalId) {
      const existingId = await prisma.user.findUnique({
        where: { nationalId: data.nationalId },
      });
      if (existingId) throw new ConflictError('National ID already in use');
    }

    // Validate department exists if provided
    if (data.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });
      if (!dept) throw new BadRequestError('Invalid department ID');
    }

    // Officer/Head must have a department
    if ((data.role === 'OFFICER' || data.role === 'HEAD') && !data.departmentId) {
      throw new BadRequestError('Officers and Heads must be assigned to a department');
    }

    const hashedPassword = await PasswordService.hash(data.password);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
      select: userSelect,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_CREATED_BY_ADMIN',
        entityType: 'User',
        entityId: user.id,
        userId: actorId,
        newValue: { email: user.email, role: user.role },
      },
    });

    return user as SafeUser;
  }

  /**
   * List users with pagination, search, and filters
   */
  static async list(params: ListUsersInput): Promise<{ users: SafeUser[]; meta: PaginationMeta }> {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      role,
      departmentId,
      isActive,
      isEmailVerified,
    } = params;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) where.role = role;
    if (departmentId) where.departmentId = departmentId;
    if (isActive !== undefined) where.isActive = isActive;
    if (isEmailVerified !== undefined) where.isEmailVerified = isEmailVerified;

    const orderBy: Prisma.UserOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder }
      : { createdAt: sortOrder };

    const { skip, take } = getPrismaSkipTake(page, limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userSelect,
        orderBy,
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users as SafeUser[],
      meta: getPaginationMeta(total, page, limit),
    };
  }

  /**
   * Get single user by ID
   */
  static async getById(id: string): Promise<SafeUser> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) throw new NotFoundError('User not found');
    return user as SafeUser;
  }

  /**
   * Update user
   */
  static async update(id: string, data: UpdateUserInput, actorId: string): Promise<SafeUser> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('User not found');

    // Check email uniqueness if changing
    if (data.email && data.email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email: data.email } });
      if (emailTaken) throw new ConflictError('Email already in use');
    }

    // Check nationalId uniqueness if changing
    if (data.nationalId && data.nationalId !== existing.nationalId) {
      const idTaken = await prisma.user.findUnique({
        where: { nationalId: data.nationalId },
      });
      if (idTaken) throw new ConflictError('National ID already in use');
    }

    // Validate department if changing
    if (data.departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });
      if (!dept) throw new BadRequestError('Invalid department ID');
    }

    // Officer/Head must have a department
    const newRole = data.role || existing.role;
    const newDeptId = data.departmentId !== undefined ? data.departmentId : existing.departmentId;
    if ((newRole === 'OFFICER' || newRole === 'HEAD') && !newDeptId) {
      throw new BadRequestError('Officers and Heads must be assigned to a department');
    }

    const updateData: Prisma.UserUpdateInput = { ...data };
    delete (updateData as any).departmentId;

    if (data.departmentId !== undefined) {
      updateData.department = data.departmentId
        ? { connect: { id: data.departmentId } }
        : { disconnect: true };
    }

    if (data.password) {
      updateData.password = await PasswordService.hash(data.password);
    }

    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });

    // If password changed, revoke all sessions
    if (data.password) {
      await prisma.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_UPDATED',
        entityType: 'User',
        entityId: id,
        userId: actorId,
        oldValue: { email: existing.email, role: existing.role },
        newValue: data as Prisma.InputJsonValue,
      },
    });

    return user as SafeUser;
  }

  /**
   * Delete user
   */
  static async delete(id: string, actorId: string): Promise<void> {
    if (id === actorId) {
      throw new BadRequestError('You cannot delete your own account');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('User not found');

    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: 'USER_DELETED',
        entityType: 'User',
        entityId: id,
        userId: actorId,
        oldValue: { email: user.email, role: user.role },
      },
    });
  }

  /**
   * Get user statistics
   */
  static async getStats(): Promise<{
    total: number;
    byRole: Record<string, number>;
    active: number;
    verified: number;
  }> {
    const [total, active, verified, roleGroups] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isEmailVerified: true } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
    ]);

    const byRole = roleGroups.reduce(
      (acc, group) => {
        acc[group.role] = group._count;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, byRole, active, verified };
  }
}
