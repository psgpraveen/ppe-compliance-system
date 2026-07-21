import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from './AppError';

export const errorHandler: ErrorRequestHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  const error = err as any;
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error.';
  let errors = error.errors || undefined;

  // Handle PostgreSQL Foreign Key Violations
  if (error.code === '23503') {
    statusCode = 400;
    message = 'Cannot delete or update this record because it is currently in use by other records.';
    
    if (error.message.includes('employees_department_id_fkey')) {
      message = 'Cannot delete this department because there are employees assigned to it. Please reassign or delete them first.';
    }
  }

  // Handle PostgreSQL Unique Violations
  if (error.code === '23505') {
    statusCode = 400;
    message = 'A record with this information already exists.';
  }

  console.error('[Error]:', err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};
