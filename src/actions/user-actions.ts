'use server';

import { authApi } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

export async function createUserAction(data: any) {
    try {
        await authApi.register(data);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function updateUserAction(id: number, data: any) {
    try {
        await authApi.updateUser(id, data);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function deleteUserAction(id: number) {
    try {
        await authApi.deleteUser(id);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}
