import { Request, Response } from 'express';
import { DepartmentsService } from './departments.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UnauthorizedError } from '../../utils/AppError.js';

export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const dept = await DepartmentsService.create(req.body, req.user.id);
  return ApiResponse.created(res, dept, 'Department created successfully');
});

export const listDepartments = asyncHandler(async (req: Request, res: Response) => {
  const { departments, meta } = await DepartmentsService.list(req.query as any);
  return ApiResponse.success(res, departments, 'Departments retrieved', 200, meta);
});

export const getAllDepartments = asyncHandler(async (_req: Request, res: Response) => {
  const departments = await DepartmentsService.getAll();
  return ApiResponse.success(res, departments, 'All active departments');
});

export const getDepartment = asyncHandler(async (req: Request, res: Response) => {
  const dept = await DepartmentsService.getById(req.params.id);
  return ApiResponse.success(res, dept, 'Department retrieved');
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const dept = await DepartmentsService.update(req.params.id, req.body, req.user.id);
  return ApiResponse.success(res, dept, 'Department updated successfully');
});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  await DepartmentsService.delete(req.params.id, req.user.id);
  return ApiResponse.success(res, null, 'Department deleted successfully');
});
