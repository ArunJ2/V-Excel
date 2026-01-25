'use client';

import { useState } from 'react';
import { generateReportAction } from '@/actions/report-actions';

export default function DashboardButtons({ studentId }: { studentId: number }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await generateReportAction(studentId, 'Screening');
            if (res.error) {
                alert('Generation failed: ' + res.error);
            } else {
                alert('Report generated successfully! View it in the "Plans & Reports" tab.');
            }
        } catch (err) {
            alert('Something went wrong.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];

            // First fetch the student's documents to find the latest one
            const docsRes = await fetch(`http://localhost:5000/api/documents/student/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!docsRes.ok) {
                throw new Error('Failed to fetch documents');
            }

            const documents = await docsRes.json();

            if (!documents || documents.length === 0) {
                alert('No documents found for this student. Generate a report first.');
                return;
            }

            // Get the first (latest) document
            const latestDoc = documents[0];

            const response = await fetch(`http://localhost:5000/api/documents/download/${latestDoc.id}`, {
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
            a.download = latestDoc.filename || `student_${studentId}_report.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download the file. The file may not exist on the server.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50 active:scale-95 transition-all"
            >
                {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>
        </div>
    );
}
