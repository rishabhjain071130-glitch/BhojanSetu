import { z } from 'zod';

export const baseListingSchema = z.object({
  eventName: z.string().trim().min(2, 'Event name is required (min 2 characters)'),
  eventType: z.enum(['wedding', 'banquet', 'catering', 'college', 'community', 'other'], {
    errorMap: () => ({ message: 'Invalid event type' }),
  }),
  foodTitle: z.string().trim().min(2, 'Food title is required (min 2 characters)'),
  foodCategory: z.enum(
    [
      'cooked_meals',
      'packaged_ration',
      'bakery',
      'desserts',
      'fruits_vegetables',
      'beverages',
      'other',
    ],
    {
      errorMap: () => ({ message: 'Invalid food category' }),
    }
  ),
  description: z.string().trim().min(5, 'Detailed description is required (min 5 characters)'),
  quantity: z.number().positive('Quantity must be a positive number'),
  unit: z.enum(['kg', 'servings', 'meal_boxes', 'trays', 'other'], {
    errorMap: () => ({ message: 'Invalid unit' }),
  }),
  preparedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid preparation date/time is required',
  }),
  storageConditions: z
    .string()
    .trim()
    .min(3, 'Storage & handling conditions are required (e.g., hot stored >65C, refrigerated <5C)'),
  allergenNotes: z.string().trim().optional(),
  collectionDeadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid collection deadline is required',
  }),
  areaOrAddress: z.string().trim().min(2, 'Approximate area or locality is required'),
  pickupInstructions: z.string().trim().min(2, 'Private pickup instructions are required'),
});

export const createListingSchema = baseListingSchema.refine(
  (data) => {
    const deadline = new Date(data.collectionDeadline);
    return deadline.getTime() > Date.now();
  },
  {
    message: 'Collection deadline must be in the future',
    path: ['collectionDeadline'],
  }
);

export const updateListingSchema = baseListingSchema.partial();
