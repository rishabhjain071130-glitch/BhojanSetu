import { z } from 'zod';

export const createRequestSchema = z.object({
  requestedQuantity: z.number().positive('Requested quantity must be greater than zero'),
  collectionNote: z.string().trim().min(3, 'Collection note is required (min 3 characters)'),
});

export const requestDecisionSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: 'Decision status must be approved or rejected' }),
  }),
  reason: z.string().trim().optional(),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['collected', 'delivered'], {
    errorMap: () => ({ message: 'Status must be collected or delivered' }),
  }),
  reason: z.string().trim().optional(),
});
