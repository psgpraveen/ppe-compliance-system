import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiResponse } from '../../shared/response/ApiResponse';

export const validateRequest: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    ApiResponse.error(res, 'Validation Error', errors.array(), 400);
    return;
  }
  next();
};

export const loginValidation: RequestHandler[] = [
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
  validateRequest
];

export const registerValidation: RequestHandler[] = [
  body('firstName').notEmpty().withMessage('First name is required.'),
  body('lastName').notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  validateRequest
];

export const changePasswordValidation: RequestHandler[] = [
  body('oldPassword').notEmpty().withMessage('Old password is required.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
  validateRequest
];

export const refreshValidation: RequestHandler[] = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required.'),
  validateRequest
];

export const forgotPasswordValidation: RequestHandler[] = [
  body('email').isEmail().withMessage('Valid email is required.'),
  validateRequest
];

export const resetPasswordValidation: RequestHandler[] = [
  body('token').notEmpty().withMessage('Reset token is required.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
  validateRequest
];
