import prisma from '../config/database.js';
import { parsePDF } from '../utils/pdfParser.js';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
export const uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const { student_id, type } = req.body;
    const { filename, path: filePath } = req.file;
    try {
        const document = await prisma.document.create({
            data: {
                student_id: parseInt(student_id),
                filename,
                file_path: filePath,
                type,
                uploaded_by: req.user.id,
                status: 'pending'
            }
        });
        try {
            const extractedData = await parsePDF(filePath);
            const updatedDoc = await prisma.document.update({
                where: { id: document.id },
                data: {
                    status: 'processed',
                    extracted_data: JSON.stringify(extractedData)
                }
            });
            res.status(201).json(updatedDoc);
        }
        catch (parseErr) {
            const errorDoc = await prisma.document.update({
                where: { id: document.id },
                data: { status: 'error' }
            });
            res.status(201).json(errorDoc);
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getAllDocuments = async (req, res) => {
    try {
        const documents = await prisma.document.findMany({
            orderBy: { created_at: 'desc' },
            include: { student: { select: { name: true } } }
        });
        res.json(documents);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getStudentDocuments = async (req, res) => {
    const { studentId } = req.params;
    try {
        const documents = await prisma.document.findMany({
            where: { student_id: parseInt(studentId) },
            orderBy: { created_at: 'desc' }
        });
        res.json(documents);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const generateReport = async (req, res) => {
    const { student_id, type } = req.body;
    if (!student_id || !type) {
        return res.status(400).json({ message: 'Missing student_id or type' });
    }
    try {
        // Fetch student data with all related information
        const student = await prisma.student.findUnique({
            where: { id: parseInt(student_id) },
            include: {
                clinical_history: true,
                milestones: true,
                adl: true,
                observations: true
            }
        });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const filename = `${student.name.replace(/\s+/g, '_')}_${type}_Report_${Date.now()}.pdf`;
        const filePath = path.join('uploads', filename);
        // Ensure uploads directory exists
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads', { recursive: true });
        }
        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        // Header
        doc.fontSize(24).fillColor('#0E4A67').text('V-Excel Student Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).fillColor('#666').text(`Report Type: ${type}`, { align: 'center' });
        doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' });
        doc.moveDown(2);
        // Student Info
        doc.fontSize(16).fillColor('#0E4A67').text('Student Information');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#333');
        doc.text(`Name: ${student.name}`);
        doc.text(`IPP Number: ${student.ipp_number}`);
        doc.text(`Date of Birth: ${student.dob.toLocaleDateString('en-GB')}`);
        doc.text(`Gender: ${student.gender || 'N/A'}`);
        doc.text(`Disability Type: ${student.disability_type || 'N/A'}`);
        doc.text(`Parent/Guardian: ${student.parent_names || 'N/A'}`);
        doc.text(`Contact: ${student.parent_contact || 'N/A'}`);
        doc.moveDown(2);
        // Clinical History
        if (student.clinical_history) {
            doc.fontSize(16).fillColor('#0E4A67').text('Clinical History');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#333');
            doc.text(`Family Structure: ${student.clinical_history.family_structure || 'N/A'}`);
            doc.text(`Home Language: ${student.clinical_history.home_language || 'N/A'}`);
            doc.text(`Pregnancy Duration: ${student.clinical_history.pregnancy_duration || 'N/A'}`);
            doc.text(`Delivery: ${student.clinical_history.delivery_nature || 'N/A'}`);
            doc.text(`Birth Weight: ${student.clinical_history.birth_weight || 'N/A'}`);
            doc.text(`Current Medications: ${student.clinical_history.current_medications || 'None'}`);
            doc.text(`Allergies: ${student.clinical_history.allergies || 'None'}`);
            doc.moveDown(2);
        }
        // Developmental Milestones
        if (student.milestones) {
            doc.fontSize(16).fillColor('#0E4A67').text('Developmental Milestones');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#333');
            doc.text(`Social Smile: ${student.milestones.social_smile || 'N/A'}`);
            doc.text(`Neck Control: ${student.milestones.neck_control || 'N/A'}`);
            doc.text(`Crawling: ${student.milestones.crawling || 'N/A'}`);
            doc.text(`Walking: ${student.milestones.walking || 'N/A'}`);
            doc.text(`Speech Initiation: ${student.milestones.speech_initiation || 'N/A'}`);
            doc.moveDown(2);
        }
        // Clinical Observations
        if (student.observations) {
            doc.fontSize(16).fillColor('#0E4A67').text('Clinical Observations');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#333');
            doc.text(`General Appearance: ${student.observations.general_appearance || 'N/A'}`);
            doc.text(`Psychomotor Skills: ${student.observations.psychomotor_skills || 'N/A'}`);
            doc.text(`Sensory Issues: ${student.observations.sensory_issues || 'N/A'}`);
            doc.text(`Cognition & Memory: ${student.observations.cognition_memory || 'N/A'}`);
            doc.text(`Communication (Expressive): ${student.observations.communication_expressive || 'N/A'}`);
            doc.text(`Communication (Receptive): ${student.observations.communication_receptive || 'N/A'}`);
            doc.text(`Social Interaction: ${student.observations.social_interaction || 'N/A'}`);
            doc.moveDown(2);
        }
        // Footer
        doc.fontSize(9).fillColor('#999').text('This report was auto-generated by V-Excel Student Portal', { align: 'center' });
        doc.end();
        // Wait for the PDF to be fully written
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        // Save to database
        const document = await prisma.document.create({
            data: {
                student_id: parseInt(student_id),
                filename: filename,
                file_path: filePath,
                type: type,
                uploaded_by: req.user.id,
                status: 'processed',
                extracted_data: JSON.stringify({ summary: `Auto-generated ${type} report for ${student.name}` })
            }
        });
        res.status(201).json(document);
    }
    catch (err) {
        console.error('Generate report error:', err);
        res.status(500).json({ message: err.message });
    }
};
export const downloadDocument = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await prisma.document.findUnique({
            where: { id: parseInt(id) }
        });
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // Handle both old mock paths and new real paths
        let filePath;
        if (document.file_path.startsWith('mock_path/')) {
            // Old mock files don't exist
            return res.status(404).json({ message: 'This is an old report. Please generate a new one.' });
        }
        else if (document.file_path.startsWith('uploads/')) {
            // Resolve relative to current working directory
            filePath = path.resolve(process.cwd(), document.file_path);
        }
        else {
            // Absolute path or other
            filePath = path.resolve(document.file_path);
        }
        console.log('Attempting to download from:', filePath);
        if (!fs.existsSync(filePath)) {
            console.log('File not found at:', filePath);
            return res.status(404).json({ message: 'File not found on server' });
        }
        res.setHeader('Content-Disposition', `attachment; filename="${document.filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
    catch (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: err.message });
    }
};
