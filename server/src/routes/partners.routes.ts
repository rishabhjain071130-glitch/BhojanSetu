import { Router } from 'express';
import {
  getPartnerProfile,
  updatePartnerProfile,
  submitVerification,
  getAdminPartners,
  updatePartnerVerificationByAdmin,
} from '../controllers/partners.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { updatePartnerVerificationSchema } from '../validators/auth.validator.js';

const router = Router();

// Partner self routes
router.get('/me', authenticate, requireRole('partner'), getPartnerProfile);
router.patch('/me', authenticate, requireRole('partner'), updatePartnerProfile);
router.post('/me/verification', authenticate, requireRole('partner'), submitVerification);

// Admin review routes
router.get('/admin', authenticate, requireRole('admin'), getAdminPartners);
router.patch(
  '/admin/:id/verification',
  authenticate,
  requireRole('admin'),
  validateBody(updatePartnerVerificationSchema),
  updatePartnerVerificationByAdmin
);

export default router;
