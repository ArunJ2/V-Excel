import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiFetchServer(endpoint: string, options: RequestInit = {}) {
    const token = cookies().get('token')?.value;

    const headers: Record<string, string> = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
}

export const authApi = {
    login: (credentials: any) => apiFetchServer('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    getAllUsers: () => apiFetchServer('/auth/users'),
    register: (data: any) => apiFetchServer('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateUser: (id: number, data: any) => apiFetchServer(`/auth/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteUser: (id: number) => apiFetchServer(`/auth/users/${id}`, {
        method: 'DELETE',
    }),
};

export const studentApi = {
    getAll: () => apiFetchServer('/students'),
    getById: (id: string | number) => apiFetchServer(`/students/${id}`),
    getByIpp: (ipp: string) => apiFetchServer(`/students/ipp/${ipp}`),
    create: (data: any) => apiFetchServer('/students', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: string | number, data: any) => apiFetchServer(`/students/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    delete: (id: string | number) => apiFetchServer(`/students/${id}`, {
        method: 'DELETE',
    }),
};

export const recordApi = {
    save: (data: any) => apiFetchServer('/records', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    saveVersion: (data: any) => apiFetchServer('/records', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};
