import { Request, Response } from 'express';
import { ReportsService } from './reports.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { UnauthorizedError, NotFoundError } from '../../utils/AppError.js';

const parseFilters = (req: Request) => {
  const { startDate, endDate, departmentId } = req.query;
  return {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    departmentId: departmentId as string | undefined,
  };
};

export const getOverview = asyncHandler(async (req: Request, res: Response) => {
  const filters = parseFilters(req);
  const overview = await ReportsService.getOverview(filters);
  return ApiResponse.success(res, overview, 'System overview retrieved');
});

export const getRequestsByDepartment = asyncHandler(async (req: Request, res: Response) => {
  const filters = parseFilters(req);
  const data = await ReportsService.getRequestsByDepartment(filters);
  return ApiResponse.success(res, data, 'Requests by department retrieved');
});

export const getRevenueByDepartment = asyncHandler(async (req: Request, res: Response) => {
  const filters = parseFilters(req);
  const data = await ReportsService.getRevenueByDepartment(filters);
  return ApiResponse.success(res, data, 'Revenue by department retrieved');
});

export const getPopularServices = asyncHandler(async (req: Request, res: Response) => {
  const filters = parseFilters(req);
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const data = await ReportsService.getPopularServices(limit, filters);
  return ApiResponse.success(res, data, 'Popular services retrieved');
});

export const getRequestsTimeSeries = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 30;
  const data = await ReportsService.getRequestsTimeSeries(days);
  return ApiResponse.success(res, data, 'Time series data retrieved');
});

export const getUserGrowth = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string) : 30;
  const data = await ReportsService.getUserGrowth(days);
  return ApiResponse.success(res, data, 'User growth data retrieved');
});

export const getDepartmentReport = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();

  const filters = parseFilters(req);
  const report = await ReportsService.getDepartmentReport(req.params.id, req.user, filters);

  if (!report) throw new NotFoundError('Department not found');
  return ApiResponse.success(res, report, 'Department report retrieved');
});

export const exportRequestsCSV = asyncHandler(async (req: Request, res: Response) => {
  const filters = parseFilters(req);
  const csv = await ReportsService.exportRequestsCSV(filters);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="requests-${Date.now()}.csv"`);
  res.send(csv);
});
