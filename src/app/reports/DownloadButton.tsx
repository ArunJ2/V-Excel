"use client";

import { FaDownload } from "react-icons/fa6";
import { useState } from "react";

interface DownloadButtonProps {
    documentId: number;
}

export default function DownloadButton({ documentId }: DownloadButtonProps) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];

            const response = await fetch(`http://localhost:5000/api/documents/download/${documentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Get filename from Content-Disposition header or use default
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
                : `document_${documentId}.pdf`;

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download error:', error);
            alert('This report was created before PDF generation was enabled. Please generate a new report from the student dashboard to download it.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={downloading}
            className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 justify-end ml-auto transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <FaDownload className="text-xs" />
            {downloading ? 'Downloading...' : 'Download'}
        </button>
    );
}
