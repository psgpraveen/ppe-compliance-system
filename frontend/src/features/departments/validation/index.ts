import { z } from 'zod';

export const departmentSchema = z.object({
  siteId: z.string().uuid('Please select a site'),
  name: z.string().min(1, 'Department name is required').max(100, 'Department name is too long'),
  supervisorId: z.string().uuid('Invalid supervisor ID').optional().or(z.literal('')),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
