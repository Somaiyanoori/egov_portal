import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).trim(),
    nameFa: z.string().min(2).max(150).trim().optional(),
    description: z.string().max(500).optional(),
    descriptionFa: z.string().max(500).optional(),
    code: z.string().min(2).max(20).toUpperCase().trim().optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateDepartmentSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid department ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(150).trim().optional(),
    nameFa: z.string().min(2).max(150).trim().optional().nullable(),
    description: z.string().max(500).optional().nullable(),
    descriptionFa: z.string().max(500).optional().nullable(),
    code: z.string().min(2).max(20).toUpperCase().trim().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const departmentIdSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid department ID'),
  }),
});

export const listDepartmentsSchema = z.object({
  query: paginationSchema.extend({
    isActive: z.coerce.boolean().optional(),
  }),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>['body'];
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>['body'];
export type ListDepartmentsInput = z.infer<typeof listDepartmentsSchema>['query'];
