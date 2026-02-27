'use client';

import { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { FaEye, FaTrash, FaDownload } from 'react-icons/fa';
import { deleteDocumentAction } from '@/actions/report-actions';
import PdfPreviewModal from './PdfPreviewModal';

interface Report {
    id: number;
    title: string;
    date: string;
    result?: string;
    type: string;
}

interface ReportListProps {
    reports: Report[];
    userRole: string;
}

export default function ReportList({ reports, userRole }: ReportListProps) {
    const [previewReport, setPreviewReport] = useState<Report | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [localReports, setLocalReports] = useState(reports);

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        const result = await deleteDocumentAction(id);
        if (result.success) {
            setLocalReports(prev => prev.filter(r => r.id !== id));
        } else {
            alert('Delete failed: ' + (result.error || 'Unknown error'));
        }
        setDeletingId(null);
        setConfirmDeleteId(null);
    };

    if (localReports.length === 0) {
        return (
            <div className="text-sm text-slate-400 text-center py-4">
                No reports available yet.
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {localReports.map((report) => (
                    <div key={report.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-brand-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xl group-hover:bg-red-100 transition-colors flex-shrink-0">
                                    <FaFilePdf />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm truncate">{report.title}</h4>
                                    <p className="text-xs text-slate-500">{report.result ? `Result: ${report.result} • ` : ""}{report.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 hidden sm:inline">
                                    {report.type}
                                </span>
                                <button
                                    onClick={() => setPreviewReport(report)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    title="Preview"
                                >
                                    <FaEye className="text-sm" />
                                </button>
                                <a
                                    href={`/api/documents/download/${report.id}`}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                                    title="Download"
                                >
                                    <FaDownload className="text-sm" />
                                </a>
                                {(userRole === 'admin' || userRole === 'staff') && (
                                    <button
                                        onClick={() => setConfirmDeleteId(report.id)}
                                        disabled={deletingId === report.id}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                        title="Delete"
                                    >
                                        <FaTrash className="text-xs" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {previewReport && (
                <PdfPreviewModal
                    previewUrl={`/api/documents/preview/${previewReport.id}`}
                    filename={previewReport.title}
                    downloadUrl={`/api/documents/download/${previewReport.id}`}
                    onClose={() => setPreviewReport(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 z-10">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Document</h3>
                        <p className="text-sm text-slate-600 mb-6">
                            Are you sure you want to delete this document? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDeleteId)}
                                disabled={deletingId === confirmDeleteId}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deletingId === confirmDeleteId ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
