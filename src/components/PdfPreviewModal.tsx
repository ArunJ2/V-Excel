'use client';

import { useEffect } from 'react';
import { FaTimes, FaDownload } from 'react-icons/fa';

interface PdfPreviewModalProps {
    previewUrl: string;
    filename: string;
    downloadUrl: string;
    onClose: () => void;
}

export default function PdfPreviewModal({ previewUrl, filename, downloadUrl, onClose }: PdfPreviewModalProps) {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full h-full max-w-5xl max-h-[92vh] m-4 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800 truncate max-w-[60%]">{filename}</h3>
                    <div className="flex items-center gap-2">
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors"
                        >
                            <FaDownload className="text-[10px]" /> Download
                        </a>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 bg-slate-100">
                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        title={`Preview: ${filename}`}
                    />
                </div>
            </div>
        </div>
    );
}
