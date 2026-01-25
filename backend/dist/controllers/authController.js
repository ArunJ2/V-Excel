import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { signToken } from '../utils/jwt.js';
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];
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
// Internal utility for seeding or admin use
export const register = async (req, res) => {
    const { email, password, name, role, linked_student_id } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const result = await pool.query('INSERT INTO users (email, password_hash, name, role, linked_student_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role', [email, hash, name, role, linked_student_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, name, role, linked_student_id, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
