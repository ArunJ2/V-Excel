import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/authRoutes';
import studentRoutes from '../src/routes/studentRoutes';
import documentRoutes from '../src/routes/documentRoutes';
import recordRoutes from '../src/routes/recordRoutes';
import prisma from '../src/config/database';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/records', recordRoutes);

// Health check
app.get('/health', async (req, res) => {
    try {
        await prisma.user.count();
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: (err as Error).message });
    }
});

// API Info
app.get('/api-info', (req, res) => {
    res.json({
        name: "Vexcel Portal Backend",
        version: "1.0.0",
        status: "Running on Vercel"
    });
});

// Root
app.get('/', (req, res) => {
    res.json({ message: "V-Excel Backend API is running" });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
    return app(req, res);
}
