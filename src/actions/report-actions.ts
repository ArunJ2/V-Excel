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

export async function generateReportAction(studentId: number, type: string) {
    try {
        const res = await apiFetchServer(`/documents/generate`, {
            method: 'POST',
            body: JSON.stringify({ student_id: studentId, type })
        });
        revalidatePath('/dashboard');
        revalidatePath('/reports');
        return { success: true, data: res };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function downloadReportPdfAction(documentId: number) {
    // In a real app, this would return a signed URL or handle a redirect to the file path
    // For this prototype, we'll return the backend file serving URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return { url: `${backendUrl}/documents/download/${documentId}` };
}
