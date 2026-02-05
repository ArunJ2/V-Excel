import { Router } from 'express';
import { getPublicEmergencyInfo } from '../controllers/publicController.js';
const router = Router();
// Public route - NO authentication required
// This endpoint only returns emergency-relevant information
router.get('/emergency/:token', getPublicEmergencyInfo);
export default router;
