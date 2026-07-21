import { z } from 'zod';

export const siteSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(150, 'Site name is too long'),
  location: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
});

export type SiteFormData = z.infer<typeof siteSchema>;
