import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  // Never allow self-registering as admin! Only organizer or partner allowed via public signup
  role: z.enum(['organizer', 'partner'], {
    errorMap: () => ({ message: 'Role must be organizer or partner' }),
  }),
  organizationName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  partnerCapacity: z.number().positive().optional(),
  partnerServiceArea: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const updatePartnerVerificationSchema = z.object({
  status: z.enum(['verified', 'rejected', 'pending'], {
    errorMap: () => ({ message: 'Status must be verified, rejected, or pending' }),
  }),
  note: z.string().trim().optional(),
});
