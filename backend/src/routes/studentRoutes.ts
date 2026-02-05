import { Router } from 'express';
import { getAllStudents, getStudentById, getStudentByIPP, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { getStudentPublicLink, regeneratePublicToken } from '../controllers/publicController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, authorize(['admin', 'staff']), getAllStudents);
router.get('/ipp/:ipp', authenticate, authorize(['admin', 'staff', 'parent']), getStudentByIPP);
router.get('/:id', authenticate, authorize(['admin', 'staff', 'parent']), getStudentById);
router.get('/:id/public-link', authenticate, authorize(['admin', 'staff']), getStudentPublicLink);
router.post('/:id/regenerate-public-link', authenticate, authorize(['admin']), regeneratePublicToken);
router.post('/', authenticate, authorize(['admin']), createStudent);
router.patch('/:id', authenticate, authorize(['admin', 'staff']), updateStudent);
router.delete('/:id', authenticate, authorize(['admin']), deleteStudent);

export default router;
