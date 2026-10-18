import { Router } from 'express';
import {
  createRequest,
  getListingRequests,
  getMyRequests,
  makeRequestDecision,
  updateRequestStatus,
} from '../controllers/requests.controller.js';
import {
  authenticate,
  requireRole,
  requireVerifiedPartner,
} from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  createRequestSchema,
  requestDecisionSchema,
  updateRequestStatusSchema,
} from '../validators/request.validator.js';

const router = Router();

// Partner makes request on a listing
router.post(
  '/listings/:id/requests',
  authenticate,
  requireVerifiedPartner,
  validateBody(createRequestSchema),
  createRequest
);

// Partner views own requests
router.get('/requests/mine', authenticate, requireRole('partner'), getMyRequests);

// Organizer/Admin views incoming requests on a listing
router.get(
  '/listings/:id/requests',
  authenticate,
  requireRole(['organizer', 'admin']),
  getListingRequests
);

// Organizer/Admin approves or rejects a request
router.patch(
  '/requests/:id/decision',
  authenticate,
  requireRole(['organizer', 'admin']),
  validateBody(requestDecisionSchema),
  makeRequestDecision
);

// Partner or Admin updates status (collected -> delivered)
router.patch(
  '/requests/:id/status',
  authenticate,
  validateBody(updateRequestStatusSchema),
  updateRequestStatus
);

export default router;
