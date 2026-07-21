import { z } from 'zod';

export const violationTypeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH'], { required_error: 'Severity is required' }),
  is_active: z.boolean().default(true),
});

export type ViolationTypeFormData = z.infer<typeof violationTypeSchema>;
