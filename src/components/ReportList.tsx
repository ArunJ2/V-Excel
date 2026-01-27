import { FaFilePdf } from "react-icons/fa6";

interface Report {
    id: number;
    title: string;
    date: string;
    result?: string;
    type: string;
}

interface ReportListProps {
    reports: Report[];
}

export default function ReportList({ reports }: ReportListProps) {
    if (reports.length === 0) {
        return (
            <div className="text-sm text-slate-400 text-center py-4">
                No reports available yet.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {reports.map((report) => (
                <div key={report.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xl group-hover:bg-red-100 transition-colors">
                            <FaFilePdf />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{report.title}</h4>
                            <p className="text-xs text-slate-500">{report.result ? `Result: ${report.result} • ` : ""}{report.date}</p>
                        </div>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {report.type}
                    </span>
                </div>
            ))}
        </div>
    );
}

