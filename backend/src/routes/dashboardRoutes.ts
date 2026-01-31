import { Router } from 'express';
import { getCenterStats, createEvent, updateEvent, deleteEvent } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', authenticate, authorize(['admin', 'staff']), getCenterStats);
router.post('/events', authenticate, authorize(['admin']), createEvent);
router.patch('/events/:id', authenticate, authorize(['admin']), updateEvent);
router.delete('/events/:id', authenticate, authorize(['admin']), deleteEvent);

export default router;
