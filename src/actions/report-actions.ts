'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getStudentReports(studentId: number) {
    try {
        return await prisma.document.findMany({
            where: { student_id: studentId },
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                student_id: true,
                filename: true,
                file_path: true,
                type: true,
                uploaded_by: true,
                status: true,
                extracted_data: true,
                created_at: true,
                updated_at: true,
            }
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return [];
    }
}

export async function getDocumentDataAction(documentId: number) {
    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            select: {
                id: true,
                filename: true,
                type: true,
                status: true,
                file_data: true,
                created_at: true,
            }
        });

        if (!document) {
            return { success: false, error: 'Document not found' };
        }

        if (!document.file_data) {
            return { success: false, error: 'File data not available.' };
        }

        return {
            success: true,
            data: {
                id: document.id,
                filename: document.filename,
                type: document.type,
                fileData: document.file_data,
                mimeType: 'application/pdf',
            }
        };
    } catch (error) {
        console.error('Get document data error:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteDocumentAction(documentId: number) {
    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId }
        });

        if (!document) {
            return { success: false, error: 'Document not found' };
        }

        await prisma.document.delete({
            where: { id: documentId }
        });

        revalidatePath('/dashboard');
        revalidatePath('/reports');
        return { success: true };
    } catch (error) {
        console.error('Delete document error:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function generateReportAction(studentId: number, type: string) {
    try {
        const { getCurrentUser } = await import('./auth-actions');
        const user = await getCurrentUser();
        const uploadedBy = user?.id || 1;

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                clinical_history: true,
                milestones: true,
                adl: true,
                observations: true
            }
        });

        if (!student) {
            return { success: false, error: 'Student not found' };
        }

        const filename = `${student.name.replace(/\s+/g, '_')}_${type}_Report_${Date.now()}.pdf`;

        // Store a placeholder document (PDF generation requires pdfkit which is backend-only)
        const document = await prisma.document.create({
            data: {
                student_id: studentId,
                filename: filename,
                file_path: `db://${filename}`,
                type: type,
                uploaded_by: uploadedBy,
                status: 'processed',
                extracted_data: JSON.stringify({ summary: `Auto-generated ${type} report for ${student.name}` })
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/reports');
        return { success: true, document };
    } catch (error) {
        console.error('Generate report error:', error);
        return { success: false, error: (error as Error).message };
    }
}
