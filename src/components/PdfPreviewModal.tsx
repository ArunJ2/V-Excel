'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaDownload, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

interface PdfPreviewModalProps {
    previewUrl: string;
    filename: string;
    downloadUrl: string;
    onClose: () => void;
}

export default function PdfPreviewModal({ previewUrl, filename, downloadUrl, onClose }: PdfPreviewModalProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const handleIframeLoad = () => {
        setLoading(false);
    };

    const handleIframeError = () => {
        setLoading(false);
        setError('Failed to load document preview');
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
                        <a
                            href={downloadUrl}
                            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors"
                        >
                            <FaDownload className="text-[10px]" /> Download
                        </a>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 bg-slate-100 min-h-0 relative">
                    {/* Loading overlay */}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                            <div className="flex flex-col items-center gap-3">
                                <FaSpinner className="text-2xl text-brand-500 animate-spin" />
                                <p className="text-sm text-slate-500 font-medium">Loading document...</p>
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                            <div className="flex flex-col items-center gap-3 text-center p-6">
                                <FaExclamationTriangle className="text-3xl text-amber-500" />
                                <p className="text-sm text-slate-700 font-medium">{error}</p>
                                <a
                                    href={downloadUrl}
                                    className="mt-2 px-4 py-2 text-sm font-bold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
                                >
                                    Download Instead
                                </a>
                            </div>
                        </div>
                    )}

                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        title={`Preview: ${filename}`}
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                    />
                </div>
            </div>
        </div>
    );
}
