import { Request, Response } from 'express';
import { RequestsService } from './requests.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UnauthorizedError } from '../../utils/AppError.js';

export const createRequest = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const files = (req.files as Express.Multer.File[]) || [];
  const request = await RequestsService.create(req.user.id, req.body, files);

  return ApiResponse.created(res, request, 'Request submitted successfully');
});

export const listRequests = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const { requests, meta } = await RequestsService.list(req.user, req.query as any);
  return ApiResponse.success(res, requests, 'Requests retrieved', 200, meta);
});

export const getRequest = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const request = await RequestsService.getById(req.params.id, req.user);
  return ApiResponse.success(res, request, 'Request retrieved');
});

export const processRequest = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const request = await RequestsService.process(req.params.id, req.body, req.user);
  return ApiResponse.success(res, request, `Request ${req.body.status.toLowerCase()} successfully`);
});

export const cancelRequest = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const request = await RequestsService.cancel(req.params.id, req.user.id);
  return ApiResponse.success(res, request, 'Request cancelled successfully');
});

export const getMyStats = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const stats = await RequestsService.getMyStats(req.user.id);
  return ApiResponse.success(res, stats, 'Your request statistics');
});
