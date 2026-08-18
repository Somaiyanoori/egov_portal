import { Request, Response } from 'express';
import { DocumentsService } from './documents.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UnauthorizedError } from '../../utils/AppError.js';

export const getDocument = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const doc = await DocumentsService.getById(req.params.id, req.user);
  return ApiResponse.success(res, doc, 'Document retrieved');
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  await DocumentsService.delete(req.params.id, req.user.id);
  return ApiResponse.success(res, null, 'Document deleted');
});
