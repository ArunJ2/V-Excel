'use server';

import { apiFetchServer as apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

export async function uploadReport(formData: FormData) {
    try {
        // We can pass the formData directly to our API
        // Mapping 'file' to 'report' as expected by backend multer
        const backendFormData = new FormData();
        backendFormData.append('report', formData.get('file') as File);
        backendFormData.append('student_id', formData.get('studentId') as string);
        backendFormData.append('type', (formData.get('type') as string).toLowerCase());

        const report = await apiFetch('/documents/upload', {
            method: 'POST',
            body: backendFormData,
        });

        revalidatePath('/dashboard');
        return { success: true, report };

    } catch (error) {
        console.error('Upload error:', error);
        return { error: (error as Error).message || 'Failed to upload report' };
    }
}
