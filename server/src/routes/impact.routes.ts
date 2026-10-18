import { Router } from 'express';
import { getImpactSummary } from '../controllers/impact.controller.js';

const router = Router();

// Publicly accessible impact metrics derived from genuine DB records
router.get('/summary', getImpactSummary);

export default router;
