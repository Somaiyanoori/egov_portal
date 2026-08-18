import { z } from 'zod';
import { Role } from '@prisma/client';
import { paginationSchema } from '../../utils/pagination.js';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[a-z]/, 'Must contain lowercase')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Must contain special character');

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().toLowerCase().trim(),
    password: passwordSchema,
    role: z.nativeEnum(Role).default(Role.CITIZEN),
    nationalId: z.string().min(5).max(20).optional(),
    dateOfBirth: z.string().datetime().optional().or(z.string().date().optional()),
    phone: z.string().min(10).max(20).optional(),
    departmentId: z.string().cuid().optional().nullable(),
    jobTitle: z.string().max(100).optional(),
    isActive: z.boolean().optional().default(true),
    isEmailVerified: z.boolean().optional().default(false),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid user ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    password: passwordSchema.optional(),
    role: z.nativeEnum(Role).optional(),
    nationalId: z.string().min(5).max(20).optional().nullable(),
    dateOfBirth: z.string().datetime().optional().nullable(),
    phone: z.string().min(10).max(20).optional().nullable(),
    departmentId: z.string().cuid().optional().nullable(),
    jobTitle: z.string().max(100).optional().nullable(),
    isActive: z.boolean().optional(),
    isEmailVerified: z.boolean().optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid user ID'),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid user ID'),
  }),
});

export const listUsersSchema = z.object({
  query: paginationSchema.extend({
    role: z.nativeEnum(Role).optional(),
    departmentId: z.string().cuid().optional(),
    isActive: z.coerce.boolean().optional(),
    isEmailVerified: z.coerce.boolean().optional(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type ListUsersInput = z.infer<typeof listUsersSchema>['query'];
