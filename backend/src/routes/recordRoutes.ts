import { Router } from 'express';
import { saveRecordVersion, getRecordVersions } from '../controllers/recordController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticate, authorize(['admin', 'staff']), saveRecordVersion);
router.get('/:entityType/:entityId', authenticate, getRecordVersions);

export default router;
