import { Router } from 'express';
import multer from 'multer';
import { getAllStudents, getStudentById, getStudentByIPP, createStudent, updateStudent, deleteStudent, uploadProfilePicture } from '../controllers/studentController.js';
import { getStudentPublicLink, regeneratePublicToken } from '../controllers/publicController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Multer for profile picture upload (memory storage for serverless)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

router.get('/', authenticate, authorize(['admin', 'staff']), getAllStudents);
router.get('/ipp/:ipp', authenticate, authorize(['admin', 'staff', 'parent']), getStudentByIPP);
router.get('/:id', authenticate, authorize(['admin', 'staff', 'parent']), getStudentById);
router.get('/:id/public-link', authenticate, authorize(['admin', 'staff']), getStudentPublicLink);
router.post('/:id/regenerate-public-link', authenticate, authorize(['admin']), regeneratePublicToken);
router.post('/:id/profile-picture', authenticate, authorize(['admin', 'staff']), upload.single('photo'), uploadProfilePicture);
router.post('/', authenticate, authorize(['admin']), createStudent);
router.patch('/:id', authenticate, authorize(['admin', 'staff']), updateStudent);
router.delete('/:id', authenticate, authorize(['admin']), deleteStudent);

export default router;
