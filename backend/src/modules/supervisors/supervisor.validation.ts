import { body } from 'express-validator';
import { validateRequest } from '../auth/auth.validation';
import { RequestHandler } from 'express';

export const createSupervisorValidation: RequestHandler[] = [
  body('firstName').notEmpty().withMessage('First name is required.'),
  body('lastName').notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  validateRequest
];

export const updateSupervisorValidation: RequestHandler[] = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty.'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty.'),
  body('email').optional().isEmail().withMessage('Valid email is required.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
  validateRequest
];
