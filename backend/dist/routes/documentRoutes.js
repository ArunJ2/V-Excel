import { Router } from 'express';
import multer from 'multer';
import { uploadDocument, getStudentDocuments } from '../controllers/documentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = Router();
// Multer setup for PDF storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});
router.post('/upload', authenticate, authorize(['admin', 'staff']), upload.single('report'), uploadDocument);
router.get('/student/:studentId', authenticate, getStudentDocuments);
export default router;
