'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { error: 'Invalid credentials' };
        }

        // Dynamic import bcryptjs to avoid edge runtime issues
        const bcrypt = (await import('bcryptjs')).default;
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return { error: 'Invalid credentials' };
        }

        const token = Buffer.from(JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })).toString('base64');

        // Set token in cookie
        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        // Set user info in cookie for easy access
        cookies().set('user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            linked_student_id: user.linked_student_id
        }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Database connection failed' };
    }

    redirect('/dashboard');
}

export async function logout() {
    cookies().delete('token');
    cookies().delete('user');
    redirect('/');
}

// Helper to get current user from cookie
export async function getCurrentUser() {
    const tokenCookie = cookies().get('token')?.value;
    if (!tokenCookie) return null;

    try {
        const decoded = JSON.parse(Buffer.from(tokenCookie, 'base64').toString());
        if (decoded.exp < Date.now()) return null;
        return decoded;
    } catch {
        return null;
    }
}
