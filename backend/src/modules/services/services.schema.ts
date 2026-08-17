import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination.js';

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).trim(),
    nameFa: z.string().min(2).max(150).trim().optional(),
    description: z.string().max(1000).optional(),
    descriptionFa: z.string().max(1000).optional(),
    fee: z.coerce.number().min(0).default(0),
    processingDays: z.coerce.number().int().min(1).max(365).default(7),
    requiredDocuments: z.array(z.string()).optional(),
    departmentId: z.string().cuid('Invalid department ID'),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid service ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(150).trim().optional(),
    nameFa: z.string().min(2).max(150).trim().optional().nullable(),
    description: z.string().max(1000).optional().nullable(),
    descriptionFa: z.string().max(1000).optional().nullable(),
    fee: z.coerce.number().min(0).optional(),
    processingDays: z.coerce.number().int().min(1).max(365).optional(),
    requiredDocuments: z.array(z.string()).optional(),
    departmentId: z.string().cuid().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const serviceIdSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid service ID'),
  }),
});

export const listServicesSchema = z.object({
  query: paginationSchema.extend({
    departmentId: z.string().cuid().optional(),
    isActive: z.coerce.boolean().optional(),
    minFee: z.coerce.number().min(0).optional(),
    maxFee: z.coerce.number().min(0).optional(),
  }),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>['body'];
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>['body'];
export type ListServicesInput = z.infer<typeof listServicesSchema>['query'];
