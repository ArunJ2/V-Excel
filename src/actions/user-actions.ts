'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createUserAction(data: any) {
    try {
        const bcrypt = (await import('bcryptjs')).default;

        // For parent accounts, UDID is mandatory
        if (data.role === 'parent') {
            if (!data.linked_student_udid) {
                return { error: 'Student UDID is required for parent accounts' };
            }

            const student = await prisma.student.findUnique({
                where: { udid: data.linked_student_udid }
            });

            if (!student) {
                return { error: 'Invalid Student UDID. No student found with this identifier.' };
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(data.password, salt);

            await prisma.user.create({
                data: {
                    email: data.email,
                    password_hash: hash,
                    name: data.name,
                    role: data.role,
                    linked_student_id: student.id,
                    linked_student_udid: student.udid,
                }
            });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(data.password, salt);

            await prisma.user.create({
                data: {
                    email: data.email,
                    password_hash: hash,
                    name: data.name,
                    role: data.role,
                }
            });
        }

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function updateUserAction(id: number, data: any) {
    try {
        const updateData: any = {
            email: data.email,
            name: data.name,
            role: data.role,
            linked_student_id: data.linked_student_id ? parseInt(data.linked_student_id) : null,
        };

        if (data.password) {
            const bcrypt = (await import('bcryptjs')).default;
            const salt = await bcrypt.genSalt(10);
            updateData.password_hash = await bcrypt.hash(data.password, salt);
        }

        await prisma.user.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function deleteUserAction(id: number) {
    try {
        await prisma.user.delete({ where: { id } });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function getAllUsersAction() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                linked_student_id: true,
                created_at: true,
            },
            orderBy: { created_at: 'desc' }
        });
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}
