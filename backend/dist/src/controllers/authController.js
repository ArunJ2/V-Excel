import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { signToken } from '../utils/jwt.js';
export const login = async (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const register = async (req, res) => {
    const { email, password, name, role, linked_student_id } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hash,
                name,
                role,
                linked_student_id: linked_student_id ? parseInt(linked_student_id) : null,
            }
        });
        const { password_hash, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getAllUsers = async (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, name, role, linked_student_id, password } = req.body;
    try {
        const data = {
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
            where: { id: parseInt(id) },
            data
        });
        const { password_hash, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'User deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
