'use server';

import { authApi } from '@/lib/api-server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const data = await authApi.login({ email, password });

        // Set token in cookie
        cookies().set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        // Set user info in cookie for easy access (optional, or just use JWT on backend)
        cookies().set('user', JSON.stringify(data.user), {
            httpOnly: false, // Accessible by client if needed
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

    } catch (error) {
        return { error: (error as Error).message };
    }

    redirect('/dashboard');
}

export async function logout() {
    cookies().delete('token');
    cookies().delete('user');
    redirect('/');
}
