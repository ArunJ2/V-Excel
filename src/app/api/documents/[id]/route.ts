import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = cookies().get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const resp = await fetch(`${API_URL}/documents/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!resp.ok) {
            const errorData = await resp.json().catch(() => ({ message: 'Delete failed' }));
            return NextResponse.json(errorData, { status: resp.status });
        }

        const data = await resp.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Delete proxy error:', error);
        return NextResponse.json({ message: 'Failed to delete document' }, { status: 502 });
    }
}
