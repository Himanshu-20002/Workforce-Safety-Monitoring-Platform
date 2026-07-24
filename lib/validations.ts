import { z } from 'zod';

/**
 * Validation schemas for forms and API requests
 *
 * To be implemented: Add schemas as needed
 */

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
