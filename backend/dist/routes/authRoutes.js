import { Router } from 'express';
import { login, register, getAllUsers } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/login', login);
router.post('/register', register); // Should be protected by admin in production
router.get('/users', authenticate, authorize(['admin']), getAllUsers);
export default router;
