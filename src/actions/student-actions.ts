'use server';

import { studentApi, recordApi } from "@/lib/api-server";
import { revalidatePath } from "next/cache";

export async function createStudentAction(data: any) {
    try {
        await studentApi.create(data);
        revalidatePath('/student-info');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function deleteStudentAction(id: number) {
    try {
        await studentApi.delete(id);
        revalidatePath('/student-info');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function getStudentProfile(ippNumber: string) {
    try {
        return await studentApi.getByIpp(ippNumber);
    } catch (error) {
        console.error('Error fetching student profile:', error);
        return null;
    }
}

export async function getStudentById(id: number) {
    try {
        return await studentApi.getById(String(id));
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        return null;
    }
}

export async function getStudentClinicalHistory(studentId: number) {
    try {
        const student = await studentApi.getById(String(studentId));
        return student.clinical_history;
    } catch (error) {
        console.error('Error fetching clinical history:', error);
        return null;
    }
}

export async function getDevelopmentalMilestones(studentId: number) {
    try {
        const student = await studentApi.getById(String(studentId));
        return student.milestones; // Fixed: Matches Prisma relation name
    } catch (error) {
        console.error('Error fetching milestones:', error);
        return null;
    }
}

export async function getDailyLivingSkills(studentId: number) {
    try {
        const student = await studentApi.getById(String(studentId));
        return student.adl; // Fixed: Matches Prisma relation name
    } catch (error) {
        console.error('Error fetching ADL:', error);
        return null;
    }
}

export async function getClinicalObservations(studentId: number) {
    try {
        const student = await studentApi.getById(String(studentId));
        return student.observations; // Fixed: Matches Prisma relation name
    } catch (error) {
        console.error('Error fetching observations:', error);
        return null;
    }
}
