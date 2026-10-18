import { Router } from 'express';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  cancelListing,
  getCandidatePartners,
} from '../controllers/listings.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  createListingSchema,
  updateListingSchema,
} from '../validators/listing.validator.js';

const router = Router();

// Public / Authenticated listings browsing
router.get('/', authenticate, getListings);
router.get('/:id', authenticate, getListingById);

// Organizer / Admin actions
router.post(
  '/',
  authenticate,
  requireRole(['organizer', 'admin']),
  validateBody(createListingSchema),
  createListing
);

router.patch(
  '/:id',
  authenticate,
  requireRole(['organizer', 'admin']),
  validateBody(updateListingSchema),
  updateListing
);

router.post(
  '/:id/cancel',
  authenticate,
  requireRole(['organizer', 'admin']),
  cancelListing
);

// Rule-based candidate matching engine recommendation
router.get(
  '/:id/candidates',
  authenticate,
  requireRole(['organizer', 'admin']),
  getCandidatePartners
);

export default router;
