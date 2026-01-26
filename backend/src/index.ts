import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import recordRoutes from './routes/recordRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// API Info for verification
app.get('/api-info', (req, res) => {
    res.json({
        name: "Vexcel Portal Backend",
        version: "1.0.0",
        status: "Running",
        endpoints: {
            auth: ["/api/auth/login", "/api/auth/register", "/api/auth/users"],
            students: ["/api/students", "/api/students/:id"],
            documents: ["/api/documents/upload", "/api/documents/all", "/api/documents/student/:id"],
            records: ["/api/records/save", "/api/records/versions/:entityType/:entityId"]
        },
        rbac_roles: ["admin", "staff", "parent"]
    });
});

// Start server only if not running in Vercel (Vercel exports the app)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Diagnostic Link: http://localhost:${PORT}/api-info`);
    });
}

// Export the Express API for Vercel
export default app;
