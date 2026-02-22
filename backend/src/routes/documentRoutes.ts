import { Router } from 'express';
import multer from 'multer';
import { uploadDocument, getStudentDocuments, getAllDocuments, generateReport, downloadDocument, previewDocument, deleteDocument } from '../controllers/documentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Multer setup - use memory storage for serverless (Vercel) compatibility
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

router.post('/upload', authenticate, authorize(['admin', 'staff']), upload.single('report'), uploadDocument);
router.post('/generate', authenticate, authorize(['admin', 'staff']), generateReport);
router.get('/all', authenticate, authorize(['admin', 'staff']), getAllDocuments);
router.get('/download/:id', authenticate, downloadDocument);
router.get('/preview/:id', authenticate, previewDocument);
router.get('/student/:studentId', authenticate, getStudentDocuments);
router.delete('/:id', authenticate, authorize(['admin', 'staff']), deleteDocument);

export default router;
