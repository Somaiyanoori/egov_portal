import { Router } from 'express';
import { Role } from '@prisma/client';
import * as controller from './reports.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// Admin-only reports
router.get('/overview', authorize(Role.ADMIN), controller.getOverview);
router.get('/requests-by-department', authorize(Role.ADMIN), controller.getRequestsByDepartment);
router.get('/revenue-by-department', authorize(Role.ADMIN), controller.getRevenueByDepartment);
router.get('/popular-services', authorize(Role.ADMIN), controller.getPopularServices);
router.get('/requests-timeseries', authorize(Role.ADMIN), controller.getRequestsTimeSeries);
router.get('/user-growth', authorize(Role.ADMIN), controller.getUserGrowth);
router.get('/export/requests', authorize(Role.ADMIN), controller.exportRequestsCSV);

// Department report (admin or head of that department)
router.get('/department/:id', authorize(Role.ADMIN, Role.HEAD), controller.getDepartmentReport);

export default router;
