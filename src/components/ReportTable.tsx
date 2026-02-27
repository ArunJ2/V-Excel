'use client';

import { useState } from 'react';
import { FaFileLines, FaEye, FaTrash, FaDownload } from 'react-icons/fa6';
import { deleteDocumentAction } from '@/actions/report-actions';
import PdfPreviewModal from './PdfPreviewModal';

interface ReportTableProps {
    reports: any[];
    userRole: string;
}

export default function ReportTable({ reports: initialReports, userRole }: ReportTableProps) {
    const [reports, setReports] = useState(initialReports);
    const [previewReport, setPreviewReport] = useState<any | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        const result = await deleteDocumentAction(id);
        if (result.success) {
            setReports(prev => prev.filter(r => r.id !== id));
        } else {
            alert('Delete failed: ' + (result.error || 'Unknown error'));
        }
        setDeletingId(null);
        setConfirmDeleteId(null);
    };

    if (reports.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500">
                No documents available.
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Document</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reports.map((report: any) => (
                            <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-brand-50 text-brand-600 flex items-center justify-center">
                                            <FaFileLines />
                                        </div>
                                        <span className="font-semibold text-slate-700 truncate max-w-[200px]">{report.filename}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-50 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-tight border border-slate-100 text-slate-600">
                                        {report.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-medium tracking-tight whitespace-nowrap">
                                    {new Date(report.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${report.status === 'processed' ? 'bg-green-100 text-green-700' :
                                        report.status === 'error' ? 'bg-red-100 text-red-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                        {report.status?.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 justify-end">
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Preview Modal */}
            {previewReport && (
                <PdfPreviewModal
                    previewUrl={`/api/documents/preview/${previewReport.id}`}
                    filename={previewReport.filename}
                    downloadUrl={`/api/documents/download/${previewReport.id}`}
                    onClose={() => setPreviewReport(null)}
                />
            )}

            {/* Delete Confirmation */}
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
