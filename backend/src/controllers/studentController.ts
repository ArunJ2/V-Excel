import type { Request, Response } from 'express';
import prisma from '../config/database.js';

export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const getStudentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const student = await prisma.student.findUnique({
            where: { id: parseInt(id as string) },
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
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const getStudentByIPP = async (req: Request, res: Response) => {
    const { ipp } = req.params;
    try {
        const student = await prisma.student.findUnique({
            where: { ipp_number: ipp as string },
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
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    const {
        udid, ipp_number, name, dob, gender, blood_group, height, weight, address,
        center_name, parent_names, parent_contact, parent_email, disability_type,
        disability_detail, clinical_case_no, therapist_assigned, referral_doctor,
        days_present, days_absent, quick_notes
    } = req.body;

    try {
        if (!udid) {
            return res.status(400).json({ message: 'UDID is required' });
        }

        // Validate UDID uniqueness
        const existingUdid = await prisma.student.findUnique({ where: { udid } });
        if (existingUdid) {
            return res.status(400).json({ message: 'UDID already exists. Please enter a unique UDID.' });
        }

        // Validate IPP uniqueness
        const existingIpp = await prisma.student.findUnique({ where: { ipp_number } });
        if (existingIpp) {
            return res.status(400).json({ message: 'IPP Number already exists.' });
        }

        const dp = days_present ? parseInt(days_present as string) : 0;
        const da = days_absent ? parseInt(days_absent as string) : 0;
        const total = dp + da;
        const attendancePercent = total > 0 ? Math.round((dp / total) * 100) : 100;

        const student = await prisma.student.create({
            data: {
                udid,
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
                days_present: dp,
                days_absent: da,
                total_working_days: total,
                attendance: attendancePercent,
                quick_notes,
            }
        });
        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const studentId = parseInt(id as string);

    try {
        if (data.dob) data.dob = new Date(data.dob);

        // Validate UDID uniqueness if updated
        if (data.udid) {
            const existingUdid = await prisma.student.findUnique({ where: { udid: data.udid } });
            if (existingUdid && existingUdid.id !== studentId) {
                return res.status(400).json({ message: 'UDID already exists. Please enter a unique UDID.' });
            }
        }

        // Auto-calculate attendance if days are provided
        if (data.days_present !== undefined || data.days_absent !== undefined) {
            const currentStudent = await prisma.student.findUnique({
                where: { id: studentId },
                select: { days_present: true, days_absent: true }
            });

            const daysPresent = data.days_present !== undefined ? parseInt(data.days_present as string) : (currentStudent?.days_present ?? 0);
            const daysAbsent = data.days_absent !== undefined ? parseInt(data.days_absent as string) : (currentStudent?.days_absent ?? 0);
            const totalDays = daysPresent + daysAbsent;

            data.total_working_days = totalDays;
            data.days_present = daysPresent;
            data.days_absent = daysAbsent;

            // Calculate attendance percentage
            if (totalDays > 0) {
                data.attendance = Math.round((daysPresent / totalDays) * 100);
            } else {
                data.attendance = 100;
            }
        } else {
            // Ensure manual attendance percentage update is ignored
            delete data.attendance;
        }

        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
                ...data,
                updated_at: new Date()
            }
        });

        res.json(student);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.student.delete({ where: { id: parseInt(id as string) } });
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const student = await prisma.student.update({
            where: { id: parseInt(id as string) },
            data: { profile_picture: base64Image }
        });

        res.json({ message: 'Profile picture updated', profile_picture: student.profile_picture });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

