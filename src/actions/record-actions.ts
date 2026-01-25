'use server';

import { recordApi, authApi, studentApi } from "@/lib/api-server";
import { revalidatePath } from "next/cache";

// Update Clinical History (Family History + Prenatal/Perinatal)
export async function updateClinicalHistory(studentId: number, data: any) {
    try {
        await recordApi.save({
            student_id: studentId,
            entity_type: 'clinical_history',
            data,
            change_reason: 'Updated via dashboard'
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// Update Developmental Milestones
export async function updateMilestones(studentId: number, data: any) {
    try {
        await recordApi.save({
            student_id: studentId,
            entity_type: 'milestones',
            data,
            change_reason: 'Updated via dashboard'
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// Update Daily Living Skills (ADL)
export async function updateADL(studentId: number, data: any) {
    try {
        await recordApi.save({
            student_id: studentId,
            entity_type: 'adl',
            data,
            change_reason: 'Updated via dashboard'
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// Update Clinical Observations
export async function updateObservations(studentId: number, data: any) {
    try {
        await recordApi.save({
            student_id: studentId,
            entity_type: 'observations',
            data,
            change_reason: 'Updated via dashboard'
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// Update Student Basic Info (attendance, next screening, etc)
export async function updateStudentInfo(studentId: number, data: any) {
    try {
        await studentApi.update(studentId, data);
        revalidatePath('/dashboard');
        revalidatePath('/student-info');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// Update User (for admin panel)
export async function updateUserAction(userId: number, data: any) {
    try {
        await authApi.updateUser(userId, data);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// Delete User (for admin panel)
export async function deleteUserAction(userId: number) {
    try {
        await authApi.deleteUser(userId);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}
