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

export const iotReportValidation: RequestHandler[] = [
  body('employeeCode').notEmpty().withMessage('Employee code is required'),
  body('violationTypeCode').notEmpty().withMessage('Violation type code is required'),
  body('imageUrl').notEmpty().withMessage('Image URL is required'),
  validateRequest
];
