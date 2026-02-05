import type { Request, Response } from 'express';
import prisma from '../config/database.js';

// Public endpoint - no authentication required
// Returns ONLY emergency-relevant information
export const getPublicEmergencyInfo = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
        const student = await prisma.student.findUnique({
            where: { public_link_token: token as string },
            select: {
                // ONLY emergency-relevant fields - nothing else
                name: true,
                blood_group: true,
                center_name: true,
                address: true,
                parent_contact: true,
                parent_email: true,
            }
        });

        if (!student) {
            return res.status(404).json({ message: 'Invalid or expired link' });
        }

        res.json({
            ...student,
            // Add a note that this is emergency-only data
            _meta: {
                type: 'emergency_info',
                disclaimer: 'This information is strictly for emergency purposes only.'
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Unable to retrieve emergency information' });
    }
};

// Generate/regenerate public link token for a student (admin only)
export const regeneratePublicToken = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Generate a new UUID token
        const crypto = await import('crypto');
        const newToken = crypto.randomUUID();

        const student = await prisma.student.update({
            where: { id: parseInt(id as string) },
            data: { public_link_token: newToken },
            select: {
                id: true,
                name: true,
                public_link_token: true
            }
        });

        res.json({
            message: 'Public emergency link regenerated successfully',
            student: {
                id: student.id,
                name: student.name,
                publicLink: `/emergency/${student.public_link_token}`
            }
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// Get student's public link (for staff to share)
export const getStudentPublicLink = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const student = await prisma.student.findUnique({
            where: { id: parseInt(id as string) },
            select: {
                id: true,
                name: true,
                udid: true,
                public_link_token: true
            }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            id: student.id,
            name: student.name,
            udid: student.udid,
            publicEmergencyLink: `/emergency/${student.public_link_token}`
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};
