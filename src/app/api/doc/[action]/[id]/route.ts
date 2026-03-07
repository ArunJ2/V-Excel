import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: { action: string; id: string } }) {
    const token = cookies().get('token')?.value;

    if (!token) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { action, id } = params;

    if (action !== 'preview' && action !== 'download') {
        return new NextResponse('Invalid action', { status: 400 });
    }

    try {
        const backendUrl = `${API_URL}/documents/${action}/${id}`;
        console.log(`[DOC PROXY] Fetching: ${backendUrl}`);

        const resp = await fetch(backendUrl, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!resp.ok) {
            const errorText = await resp.text().catch(() => 'Backend error');
            console.error(`[DOC PROXY] Error ${resp.status}: ${errorText}`);
            return new NextResponse(`Error: ${errorText}`, {
                status: resp.status,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        const contentType = resp.headers.get('content-type') || 'application/pdf';
        const buffer = await resp.arrayBuffer();
        const cdHeader = resp.headers.get('content-disposition');
        const filename = cdHeader?.match(/filename="?(.+?)"?$/)?.[1] || 'document.pdf';

        const disposition = action === 'preview'
            ? `inline; filename="${filename}"`
            : `attachment; filename="${filename}"`;

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': disposition,
                'Content-Length': buffer.byteLength.toString(),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error) {
        console.error('[DOC PROXY] Fetch error:', error);
        return new NextResponse('Failed to fetch document', { status: 502 });
    }
}
