'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaDownload, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { getDocumentDataAction } from '@/actions/report-actions';

interface PdfPreviewModalProps {
    documentId: number;
    filename: string;
    onClose: () => void;
}

export default function PdfPreviewModal({ documentId, filename, onClose }: PdfPreviewModalProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [blobUrl, setBlobUrl] = useState('');

    const fetchDocument = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const result = await getDocumentDataAction(documentId);
            if (result.success && result.data?.fileData) {
                // Convert base64 to blob
                const byteChars = atob(result.data.fileData);
                const byteNumbers = new Array(byteChars.length);
                for (let i = 0; i < byteChars.length; i++) {
                    byteNumbers[i] = byteChars.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setBlobUrl(url);
            } else {
                setError(result.error || 'Document data not available');
            }
        } catch (err) {
            setError('Failed to load document');
        }
        setLoading(false);
    }, [documentId]);

    useEffect(() => {
        fetchDocument();
        return () => {
            // Cleanup blob URL on unmount
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [fetchDocument]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const handleDownload = () => {
        if (!blobUrl) return;
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full h-full max-w-5xl max-h-[95vh] sm:max-h-[92vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[50%] sm:max-w-[60%]">{filename}</h3>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                            onClick={handleDownload}
                            disabled={!blobUrl}
                            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors disabled:opacity-50"
                        >
                            <FaDownload className="text-[10px]" /> Download
                        </button>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-slate-100 min-h-0 relative">
                    {/* Loading state */}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                            <div className="flex flex-col items-center gap-3">
                                <FaSpinner className="text-2xl text-brand-500 animate-spin" />
                                <p className="text-sm text-slate-500 font-medium">Loading document...</p>
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {error && !loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                            <div className="flex flex-col items-center gap-3 text-center p-6">
                                <FaExclamationTriangle className="text-3xl text-amber-500" />
                                <p className="text-sm text-slate-700 font-medium">{error}</p>
                                <button
                                    onClick={fetchDocument}
                                    className="mt-2 px-4 py-2 text-sm font-bold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PDF iframe */}
                    {blobUrl && !error && (
                        <iframe
                            src={blobUrl}
                            className="w-full h-full border-0"
                            title={`Preview: ${filename}`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
