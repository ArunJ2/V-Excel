'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from './auth-actions';
import { revalidatePath } from 'next/cache';

// Update Clinical History (Family History + Prenatal/Perinatal)
export async function updateClinicalHistory(studentId: number, data: any) {
    try {
        const user = await getCurrentUser();
        const changedBy = user?.id || 1;

        // Get current version
        const lastVersion = await prisma.recordVersion.findFirst({
            where: { entity_type: 'clinical_history', entity_id: studentId },
            orderBy: { version_number: 'desc' }
        });
        const nextVersion = (lastVersion?.version_number || 0) + 1;

        // Save version
        await prisma.recordVersion.create({
            data: {
                entity_type: 'clinical_history',
                entity_id: studentId,
                version_number: nextVersion,
                data: JSON.stringify(data),
                changed_by: changedBy,
                change_reason: 'Updated via dashboard'
            }
        });

        // Update active record
        await prisma.clinicalHistory.upsert({
            where: { student_id: studentId },
            update: data,
            create: { ...data, student_id: studentId }
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
        const user = await getCurrentUser();
        const changedBy = user?.id || 1;

        const lastVersion = await prisma.recordVersion.findFirst({
            where: { entity_type: 'milestones', entity_id: studentId },
            orderBy: { version_number: 'desc' }
        });
        const nextVersion = (lastVersion?.version_number || 0) + 1;

        await prisma.recordVersion.create({
            data: {
                entity_type: 'milestones',
                entity_id: studentId,
                version_number: nextVersion,
                data: JSON.stringify(data),
                changed_by: changedBy,
                change_reason: 'Updated via dashboard'
            }
        });

        await prisma.developmentalMilestones.upsert({
            where: { student_id: studentId },
            update: data,
            create: { ...data, student_id: studentId }
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
        const user = await getCurrentUser();
        const changedBy = user?.id || 1;

        const lastVersion = await prisma.recordVersion.findFirst({
            where: { entity_type: 'adl', entity_id: studentId },
            orderBy: { version_number: 'desc' }
        });
        const nextVersion = (lastVersion?.version_number || 0) + 1;

        await prisma.recordVersion.create({
            data: {
                entity_type: 'adl',
                entity_id: studentId,
                version_number: nextVersion,
                data: JSON.stringify(data),
                changed_by: changedBy,
                change_reason: 'Updated via dashboard'
            }
        });

        await prisma.dailyLivingSkills.upsert({
            where: { student_id: studentId },
            update: data,
            create: { ...data, student_id: studentId }
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
        const user = await getCurrentUser();
        const changedBy = user?.id || 1;

        const lastVersion = await prisma.recordVersion.findFirst({
            where: { entity_type: 'observations', entity_id: studentId },
            orderBy: { version_number: 'desc' }
        });
        const nextVersion = (lastVersion?.version_number || 0) + 1;

        await prisma.recordVersion.create({
            data: {
                entity_type: 'observations',
                entity_id: studentId,
                version_number: nextVersion,
                data: JSON.stringify(data),
                changed_by: changedBy,
                change_reason: 'Updated via dashboard'
            }
        });

        await prisma.clinicalObservations.upsert({
            where: { student_id: studentId },
            update: data,
            create: { ...data, student_id: studentId }
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
        if (data.dob) data.dob = new Date(data.dob);

        await prisma.student.update({
            where: { id: studentId },
            data
        });
        revalidatePath('/dashboard');
        revalidatePath('/student-info');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}
