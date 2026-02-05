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
        ipp_number, name, dob, gender, blood_group, height, weight, address,
        center_name, parent_names, parent_contact, parent_email, disability_type,
        disability_detail, clinical_case_no, therapist_assigned, referral_doctor,
        attendance, quick_notes
    } = req.body;
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
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    try {
        if (data.dob) data.dob = new Date(data.dob);

        // Auto-calculate attendance if days are provided
        if (data.days_present !== undefined || data.days_absent !== undefined) {
            const currentStudent = await prisma.student.findUnique({
                where: { id: parseInt(id as string) },
                select: { days_present: true, days_absent: true, total_working_days: true }
            });

            const daysPresent = data.days_present ?? currentStudent?.days_present ?? 0;
            const daysAbsent = data.days_absent ?? currentStudent?.days_absent ?? 0;
            const totalDays = daysPresent + daysAbsent;

            // Update total working days
            data.total_working_days = totalDays;
            data.days_present = daysPresent;
            data.days_absent = daysAbsent;

            // Calculate attendance percentage
            if (totalDays > 0) {
                data.attendance = Math.round((daysPresent / totalDays) * 100);
            } else {
                data.attendance = 100; // Default if no days entered
            }
        }

        const student = await prisma.student.update({
            where: { id: parseInt(id as string) },
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
