import { Request, Response } from 'express';
import { UsersService } from './users.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UnauthorizedError } from '../../utils/AppError.js';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const user = await UsersService.create(req.body, req.user.id);
  return ApiResponse.created(res, user, 'User created successfully');
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { users, meta } = await UsersService.list(req.query as any);
  return ApiResponse.success(res, users, 'Users retrieved', 200, meta);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UsersService.getById(req.params.id);
  return ApiResponse.success(res, user, 'User retrieved');
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const user = await UsersService.update(req.params.id, req.body, req.user.id);
  return ApiResponse.success(res, user, 'User updated successfully');
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  await UsersService.delete(req.params.id, req.user.id);
  return ApiResponse.success(res, null, 'User deleted successfully');
});

export const getUserStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await UsersService.getStats();
  return ApiResponse.success(res, stats, 'User statistics retrieved');
});
