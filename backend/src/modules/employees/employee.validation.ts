import { body } from 'express-validator';
import { validateRequest } from '../auth/auth.validation';
import { RequestHandler } from 'express';

export const createEmployeeValidation: RequestHandler[] = [
  body('employeeCode').notEmpty().withMessage('Employee code is required.'),
  body('firstName').notEmpty().withMessage('First name is required.'),
  body('lastName').notEmpty().withMessage('Last name is required.'),
  body('departmentId').notEmpty().withMessage('Department ID is required.').isUUID().withMessage('Valid Department ID is required.'),
  body('supervisorId').optional({ checkFalsy: true }).isUUID().withMessage('Valid Supervisor ID is required.'),
  body('jobProfile').optional().isString(),
  body('mobileNumber').optional({ checkFalsy: true }).isLength({ min: 10, max: 10 }).isNumeric().withMessage('Mobile number must be 10 digits.'),
  body('aadharNumber').optional({ checkFalsy: true }).isLength({ min: 12, max: 12 }).isNumeric().withMessage('Aadhar number must be 12 digits.'),
  validateRequest
];

export const updateEmployeeValidation: RequestHandler[] = [
  body('employeeCode').optional().notEmpty().withMessage('Employee code cannot be empty.'),
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty.'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty.'),
  body('departmentId').optional().notEmpty().withMessage('Department ID cannot be empty.').isUUID().withMessage('Valid Department ID is required.'),
  body('supervisorId').optional({ checkFalsy: true }).isUUID().withMessage('Valid Supervisor ID is required.'),
  body('jobProfile').optional().isString(),
  body('mobileNumber').optional({ checkFalsy: true }).isLength({ min: 10, max: 10 }).isNumeric().withMessage('Mobile number must be 10 digits.'),
  body('aadharNumber').optional({ checkFalsy: true }).isLength({ min: 12, max: 12 }).isNumeric().withMessage('Aadhar number must be 12 digits.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
  validateRequest
];

export const bulkImportValidation: RequestHandler[] = [
  body().isArray({ min: 1 }).withMessage('Payload must be an array of employees.'),
  body('*.employeeCode').notEmpty().withMessage('Employee code is required.'),
  body('*.firstName').notEmpty().withMessage('First name is required.'),
  body('*.lastName').notEmpty().withMessage('Last name is required.'),
  body('*.departmentName').notEmpty().withMessage('Department name is required.'),
  body('*.jobProfile').optional().isString(),
  body('*.mobileNumber').optional().isString(),
  body('*.aadharNumber').optional().isString(),
  validateRequest
];
