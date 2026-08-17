import { Request, Response } from 'express';
import { ServicesService } from './services.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UnauthorizedError } from '../../utils/AppError.js';

export const createService = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const service = await ServicesService.create(req.body, req.user.id);
  return ApiResponse.created(res, service, 'Service created successfully');
});

export const listServices = asyncHandler(async (req: Request, res: Response) => {
  const { services, meta } = await ServicesService.list(req.query as any);
  return ApiResponse.success(res, services, 'Services retrieved', 200, meta);
});

export const getAllServices = asyncHandler(async (_req: Request, res: Response) => {
  const services = await ServicesService.getAll();
  return ApiResponse.success(res, services, 'All active services');
});

export const getService = asyncHandler(async (req: Request, res: Response) => {
  const service = await ServicesService.getById(req.params.id);
  return ApiResponse.success(res, service, 'Service retrieved');
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const service = await ServicesService.update(req.params.id, req.body, req.user.id);
  return ApiResponse.success(res, service, 'Service updated successfully');
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  await ServicesService.delete(req.params.id, req.user.id);
  return ApiResponse.success(res, null, 'Service deleted successfully');
});
