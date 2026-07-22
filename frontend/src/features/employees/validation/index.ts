import { z } from 'zod';

export const employeeSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required').max(30, 'Code is too long'),
  firstName: z.string().min(1, 'First name is required').max(100, 'Name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Name is too long'),
  departmentId: z.string().uuid('Please select a department'),
  supervisorId: z.string().uuid('Invalid supervisor ID').optional().or(z.literal('')),
  jobProfile: z.string().optional(),
  mobileNumber: z.string().optional().refine(val => !val || /^[0-9]{10}$/.test(val), {
    message: 'Mobile number must be 10 digits'
  }),
  aadharNumber: z.string().optional().refine(val => !val || /^[0-9]{12}$/.test(val), {
    message: 'Aadhar number must be 12 digits'
  }),
  isActive: z.boolean().optional().default(true),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
