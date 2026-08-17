import { z } from 'zod';
import { RequestStatus } from '@prisma/client';
import { paginationSchema } from '../../utils/pagination.js';

export const createRequestSchema = z.object({
  body: z.object({
    serviceId: z.string().cuid('Invalid service ID'),
    notes: z.string().max(1000).optional(),
  }),
});

export const requestIdSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid request ID'),
  }),
});

export const processRequestSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid request ID'),
  }),
  body: z
    .object({
      status: z.enum(['APPROVED', 'REJECTED', 'UNDER_REVIEW']),
      rejectionReason: z.string().max(500).optional(),
    })
    .refine(
      (data) =>
        data.status !== 'REJECTED' || (data.rejectionReason && data.rejectionReason.length > 0),
      { message: 'Rejection reason is required when rejecting', path: ['rejectionReason'] },
    ),
});

export const cancelRequestSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid request ID'),
  }),
});

export const listRequestsSchema = z.object({
  query: paginationSchema.extend({
    status: z.nativeEnum(RequestStatus).optional(),
    serviceId: z.string().cuid().optional(),
    citizenId: z.string().cuid().optional(),
    departmentId: z.string().cuid().optional(),
    startDate: z.string().datetime().optional().or(z.string().date().optional()),
    endDate: z.string().datetime().optional().or(z.string().date().optional()),
  }),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>['body'];
export type ProcessRequestInput = z.infer<typeof processRequestSchema>['body'];
export type ListRequestsInput = z.infer<typeof listRequestsSchema>['query'];
