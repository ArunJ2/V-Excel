'use server';

import { apiFetchServer } from "@/lib/api-server";

export async function getStudentReports(studentId: number) {
    try {
        return await apiFetchServer(`/documents/student/${studentId}`);
    } catch (error) {
        console.error("Error fetching reports:", error);
        return [];
    }
}

