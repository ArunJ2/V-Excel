import prisma from '../config/database.js';
export const getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(students);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await prisma.student.findUnique({
            where: { id: parseInt(id) },
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
        res.json(student);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getStudentByIPP = async (req, res) => {
    const { ipp } = req.params;
    try {
        const student = await prisma.student.findUnique({
            where: { ipp_number: ipp },
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
        res.json(student);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const createStudent = async (req, res) => {
    const { ipp_number, name, dob, gender, blood_group, height, weight, address, center_name, parent_names, parent_contact, parent_email, disability_type, disability_detail, clinical_case_no, therapist_assigned, referral_doctor, attendance, quick_notes } = req.body;
    try {
        const student = await prisma.student.create({
            data: {
                ipp_number,
                name,
                dob: new Date(dob),
                gender,
                blood_group,
                height,
                weight,
                address,
                center_name,
                parent_names,
                parent_contact,
                parent_email,
                disability_type,
                disability_detail,
                clinical_case_no,
                therapist_assigned,
                referral_doctor,
                attendance: attendance ?? 100,
                quick_notes,
            }
        });
        res.status(201).json(student);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        if (data.dob)
            data.dob = new Date(data.dob);
        const student = await prisma.student.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                updated_at: new Date()
            }
        });
        res.json(student);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.student.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Student deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
