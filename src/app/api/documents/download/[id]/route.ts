import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const token = cookies().get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const resp = await fetch(`${API_URL}/documents/download/${params.id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!resp.ok) {
            const errorText = await resp.text();
            return new NextResponse(errorText, { status: resp.status });
        }

        const buffer = await resp.arrayBuffer();
        const filename = resp.headers.get('content-disposition')?.match(/filename="?(.+?)"?$/)?.[1] || 'document.pdf';

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': buffer.byteLength.toString(),
            },
        });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to download' }, { status: 500 });
    }
}
