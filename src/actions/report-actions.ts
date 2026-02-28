'use server';

import { apiFetchServer } from "@/lib/api-server";
import { revalidatePath } from "next/cache";

export async function getStudentReports(studentId: number) {
    try {
        return await apiFetchServer(`/documents/student/${studentId}`);
    } catch (error) {
        console.error("Error fetching reports:", error);
        return [];
    }
}

export async function deleteDocumentAction(documentId: number) {
    try {
        await apiFetchServer(`/documents/${documentId}`, { method: 'DELETE' });
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
        const result = await apiFetchServer('/documents/generate', {
            method: 'POST',
            body: JSON.stringify({ student_id: studentId, type }),
        });
        revalidatePath('/dashboard');
        revalidatePath('/reports');
        return { success: true, document: result };
    } catch (error) {
        console.error('Generate report error:', error);
        return { success: false, error: (error as Error).message };
    }
}
