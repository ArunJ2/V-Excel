import { Router } from 'express';
import { getAllStudents, getStudentById, createStudent, updateStudent } from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', authenticate, authorize(['admin', 'staff']), getAllStudents);
router.get('/:id', authenticate, getStudentById);
router.post('/', authenticate, authorize(['admin', 'staff']), createStudent);
router.patch('/:id', authenticate, authorize(['admin', 'staff']), updateStudent);
export default router;
