import { z } from 'zod';

export const createSupervisorSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'Name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Name is too long'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
});

export const updateSupervisorSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'Name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Name is too long'),
  email: z.string().email('Valid email is required'),
  isActive: z.boolean().optional().default(true),
});

export type CreateSupervisorFormData = z.infer<typeof createSupervisorSchema>;
export type UpdateSupervisorFormData = z.infer<typeof updateSupervisorSchema>;
