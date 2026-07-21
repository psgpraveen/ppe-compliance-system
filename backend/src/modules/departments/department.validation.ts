import { body } from 'express-validator';
import { validateRequest } from '../auth/auth.validation';
import { RequestHandler } from 'express';

export const createDepartmentValidation: RequestHandler[] = [
  body('siteId').notEmpty().withMessage('Site ID is required.').isUUID().withMessage('Valid Site ID is required.'),
  body('name').notEmpty().withMessage('Department name is required.'),
  body('supervisorId').optional({ checkFalsy: true }).isUUID().withMessage('Valid Supervisor ID is required.'),
  validateRequest
];

export const updateDepartmentValidation: RequestHandler[] = [
  body('siteId').optional().notEmpty().withMessage('Site ID cannot be empty.').isUUID().withMessage('Valid Site ID is required.'),
  body('name').optional().notEmpty().withMessage('Department name cannot be empty.'),
  body('supervisorId').optional({ checkFalsy: true }).isUUID().withMessage('Valid Supervisor ID is required.'),
  validateRequest
];
