import { Router } from 'express';
import { Role } from '@prisma/client';
import * as controller from './departments.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate, authorize, optionalAuth } from '../../middleware/auth.middleware.js';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentIdSchema,
  listDepartmentsSchema,
} from './departments.schema.js';

const router = Router();

/**
 * Public: get all active departments (for citizen registration/services)
 * @swagger
 * /departments/all:
 *   get:
 *     summary: Get all active departments (public)
 *     tags: [Departments]
 */
router.get('/all', optionalAuth, controller.getAllDepartments);

// Admin routes
router.use(authenticate, authorize(Role.ADMIN));

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: List departments with pagination
 *     tags: [Departments]
 *   post:
 *     summary: Create department
 *     tags: [Departments]
 */
router
  .route('/')
  .get(validate(listDepartmentsSchema), controller.listDepartments)
  .post(validate(createDepartmentSchema), controller.createDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *   put:
 *     summary: Update department
 *     tags: [Departments]
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
 */
router
  .route('/:id')
  .get(validate(departmentIdSchema), controller.getDepartment)
  .put(validate(updateDepartmentSchema), controller.updateDepartment)
  .delete(validate(departmentIdSchema), controller.deleteDepartment);

export default router;
