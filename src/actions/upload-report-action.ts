'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from './auth-actions';
import { revalidatePath } from 'next/cache';

export async function uploadReport(formData: FormData) {
    try {
        const user = await getCurrentUser();
        const uploadedBy = user?.id || 1;

        const file = formData.get('file') as File;
        const studentId = formData.get('studentId') as string;
        const type = (formData.get('type') as string).toLowerCase();

        if (!file) {
            return { error: 'No file uploaded' };
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileBase64 = buffer.toString('base64');
        const filename = `report-${Date.now()}-${Math.round(Math.random() * 1E9)}.pdf`;

        const document = await prisma.document.create({
            data: {
                student_id: parseInt(studentId),
                filename,
                file_path: `db://${filename}`,
                type,
                uploaded_by: uploadedBy,
                status: 'processed',
                file_data: fileBase64,
                extracted_data: JSON.stringify({ summary: 'Document uploaded successfully.' })
            }
        });

        revalidatePath('/dashboard');
        return { success: true, report: document };

    } catch (error) {
        console.error('Upload error:', error);
        return { error: (error as Error).message || 'Failed to upload report' };
    }
}
