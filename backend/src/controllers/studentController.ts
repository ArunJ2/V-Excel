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
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    const { ipp_number, name, dob, gender, address, parent_names, parent_contact, disability_type, disability_detail, clinical_case_no, therapist_assigned, referral_doctor } = req.body;
    try {
        const student = await prisma.student.create({
            data: {
                ipp_number,
                name,
                dob: new Date(dob),
                gender,
                address,
                parent_names,
                parent_contact,
                disability_type,
                disability_detail,
                clinical_case_no,
                therapist_assigned,
                referral_doctor,
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
