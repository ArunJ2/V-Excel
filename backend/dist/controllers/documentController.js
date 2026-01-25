import pool from '../config/database.js';
import { parsePDF } from '../utils/pdfParser.js';
export const uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const { student_id, type } = req.body;
    const { filename, path: filePath } = req.file;
    try {
        // 1. Initial Insert
        const result = await pool.query('INSERT INTO documents (student_id, filename, file_path, type, uploaded_by, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [student_id, filename, filePath, type, req.user.id, 'pending']);
        const docId = result.rows[0].id;
        // 2. Parse PDF and update
        try {
            const extractedData = await parsePDF(filePath);
            await pool.query('UPDATE documents SET status = $1, extracted_data = $2 WHERE id = $3', ['processed', JSON.stringify(extractedData), docId]);
            res.status(201).json({ ...result.rows[0], status: 'processed', extracted_data: extractedData });
        }
        catch (parseErr) {
            await pool.query('UPDATE documents SET status = $1 WHERE id = $2', ['error', docId]);
            res.status(201).json({ ...result.rows[0], status: 'error' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getStudentDocuments = async (req, res) => {
    const { studentId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM documents WHERE student_id = $1 ORDER BY created_at DESC', [studentId]);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
