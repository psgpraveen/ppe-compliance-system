import { body } from 'express-validator';
import { validateRequest } from '../auth/auth.validation';
import { RequestHandler } from 'express';

export const createViolationTypeValidation: RequestHandler[] = [
  body('code').notEmpty().withMessage('Code is required.'),
  body('name').notEmpty().withMessage('Name is required.'),
  body('severity')
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Severity must be LOW, MEDIUM, or HIGH.'),
  body('is_active').optional().isBoolean(),
  validateRequest
];

export const updateViolationTypeValidation: RequestHandler[] = [
  body('code').optional().notEmpty().withMessage('Code cannot be empty.'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty.'),
  body('severity').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  body('is_active').optional().isBoolean(),
  validateRequest
];
