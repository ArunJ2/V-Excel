const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiFetchClient(endpoint: string, options: RequestInit = {}) {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

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

export const studentApi = {
    getAll: () => apiFetchClient('/students'),
    getById: (id: string) => apiFetchClient(`/students/${id}`),
};
