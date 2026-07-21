import { body } from 'express-validator';
import { validateRequest } from '../auth/auth.validation';
import { RequestHandler } from 'express';

export const createSiteValidation: RequestHandler[] = [
  body('siteName').notEmpty().withMessage('Site name is required.'),
  body('location').optional({ checkFalsy: true }).isString().withMessage('Location must be a string.'),
  validateRequest
];

export const updateSiteValidation: RequestHandler[] = [
  body('siteName').optional().notEmpty().withMessage('Site name cannot be empty.'),
  body('location').optional({ checkFalsy: true }).isString().withMessage('Location must be a string.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean.'),
  validateRequest
];
