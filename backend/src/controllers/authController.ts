import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { signToken } from '../utils/jwt.js';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken({ id: user.id, email: user.email, role: user.role });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                linked_student_id: user.linked_student_id
            }
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const register = async (req: Request, res: Response) => {
    const { email, password, name, role, linked_student_udid } = req.body;

    try {
        // For parent accounts, UDID is mandatory
        if (role === 'parent') {
            if (!linked_student_udid) {
                return res.status(400).json({
                    message: 'Student UDID is required for parent accounts'
                });
            }

            // Validate student exists with this UDID
            const student = await prisma.student.findUnique({
                where: { udid: linked_student_udid }
            });

            if (!student) {
                return res.status(400).json({
                    message: 'Invalid Student UDID. No student found with this identifier.'
                });
            }

            // Create parent user with linked student
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const user = await prisma.user.create({
                data: {
                    email,
                    password_hash: hash,
                    name,
                    role,
                    linked_student_id: student.id,
                    linked_student_udid: student.udid,
                }
            });

            const { password_hash, ...userWithoutPassword } = user;
            return res.status(201).json(userWithoutPassword);
        }

        // For admin/staff - no student linking required
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hash,
                name,
                role,
            }
        });

        const { password_hash, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                linked_student_id: true,
                created_at: true,
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, name, role, linked_student_id, password } = req.body;

    try {
        const data: any = {
            email,
            name,
            role,
            linked_student_id: linked_student_id ? parseInt(linked_student_id) : null,
        };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            data.password_hash = await bcrypt.hash(password, salt);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id as string) },
            data
        });

        const { password_hash, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: parseInt(id as string) } });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};
