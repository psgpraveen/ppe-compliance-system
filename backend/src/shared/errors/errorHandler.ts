import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from './AppError';

export const errorHandler: ErrorRequestHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  const error = err as any;
  let statusCode = error.statusCode || 500;
  let message = error.message || 'An unexpected error occurred. Please try again.';
  let errors = error.errors || undefined;

  const rawMsg = (error.message || '').toLowerCase();
  const detail = (error.detail || '').toLowerCase();
  const constraint = (error.constraint || '').toLowerCase();
  const table = (error.table || '').toLowerCase();

  const isForeignKeyError = 
    error.code === '23503' || 
    rawMsg.includes('foreign key constraint') || 
    rawMsg.includes('violates restrict');

  const isUniqueError = 
    error.code === '23505' || 
    rawMsg.includes('unique constraint') || 
    rawMsg.includes('already exists');

  // Handle Foreign Key Violations (Non-tech friendly explanations)
  if (isForeignKeyError) {
    statusCode = 400;
    message = 'Cannot delete this item because other items are linked to it. Please remove linked items first.';

    if (
      constraint.includes('departments_site') || 
      rawMsg.includes('departments_site') || 
      table === 'sites' || 
      rawMsg.includes('table "sites"')
    ) {
      message = 'Cannot delete this site because departments are currently assigned to it. Please remove or move the departments first.';
    } else if (
      constraint.includes('employees_department') || 
      rawMsg.includes('employees_department') || 
      table === 'departments' || 
      rawMsg.includes('table "departments"')
    ) {
      message = 'Cannot delete this department because employees are assigned to it. Please reassign the employees first.';
    } else if (
      constraint.includes('supervisor') || 
      rawMsg.includes('supervisor') || 
      table === 'supervisors' || 
      table === 'users'
    ) {
      message = 'Cannot delete this supervisor because they are managing active departments or employees. Please reassign their duties first.';
    } else if (
      constraint.includes('violation_type') || 
      rawMsg.includes('violation_type') || 
      table === 'violation_types'
    ) {
      message = 'Cannot delete this violation type because safety incident records are linked to it.';
    } else if (
      constraint.includes('violations_employee') || 
      rawMsg.includes('violations_employee')
    ) {
      message = 'Cannot delete this employee because safety violation incidents are recorded for them.';
    }
  }

  // Handle Unique Constraint Violations (Duplicate entries)
  if (isUniqueError) {
    statusCode = 400;
    message = 'An item with this information already exists.';

    if (constraint.includes('email') || detail.includes('email') || rawMsg.includes('email')) {
      message = 'An account with this email address already exists. Please use a different email.';
    } else if (constraint.includes('employee_code') || detail.includes('employee_code') || rawMsg.includes('employee_code')) {
      message = 'An employee with this ID code already exists. Please use a different code.';
    } else if (constraint.includes('site_name') || detail.includes('site_name') || rawMsg.includes('site_name')) {
      message = 'A site with this name already exists.';
    } else if (constraint.includes('violation_types_code') || detail.includes('code') || rawMsg.includes('code')) {
      message = 'A violation category with this code already exists.';
    }
  }

  console.error('[Error Handled]:', message);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};
