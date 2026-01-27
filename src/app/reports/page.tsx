import { apiFetchServer } from "@/lib/api-server";
import { FaFileLines, FaMagnifyingGlass } from "react-icons/fa6";
import PageContainer from "@/components/PageContainer";

export default async function ReportsPage() {
    let reports: any[] = [];
    let error: string | null = null;

    try {
        reports = await apiFetchServer('/documents/all') || [];
    } catch (e) {
        error = "Unable to load reports. Please ensure you are logged in.";
    }

    const searchAction = (
        <div className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-64 shadow-sm"
            />
        </div>
    );

    if (error) {
        return (
            <PageContainer
                title="All Reports"
                subtitle="Centralized repository for all student screening and progress documents"
            >
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center">
                    {error}
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="All Reports"
            subtitle="Centralized repository for all student screening and progress documents"
            action={searchAction}
        >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {reports.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No reports found. Reports will appear here when documents are uploaded.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Report Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Uploaded Date</th>
                                <th className="px-6 py-4">Status</th>
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
                                            <span className="font-semibold text-slate-700">{report.filename}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-50 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-tight border border-slate-100 italic text-slate-600">
                                            {report.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 font-medium tracking-tight">
                                        {new Date(report.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${report.status === 'processed' ? 'bg-green-100 text-green-700' :
                                            report.status === 'error' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {report.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </PageContainer>
    );
}

