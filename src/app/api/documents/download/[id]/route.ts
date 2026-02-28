import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const token = cookies().get('token')?.value;

    if (!token) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const resp = await fetch(`${API_URL}/documents/download/${params.id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!resp.ok) {
            const errorText = await resp.text().catch(() => 'Backend error');
            console.error(`Download proxy error: ${resp.status} - ${errorText}`);
            return new NextResponse(`Error: ${errorText}`, { status: resp.status });
        }

        const contentType = resp.headers.get('content-type') || 'application/pdf';
        const buffer = await resp.arrayBuffer();
        const cdHeader = resp.headers.get('content-disposition');
        const filename = cdHeader?.match(/filename="?(.+?)"?$/)?.[1] || 'document.pdf';

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Download proxy fetch error:', error);
        return new NextResponse('Failed to download', { status: 502 });
    }
}
