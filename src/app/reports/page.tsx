import { apiFetchServer } from "@/lib/api-server";
import { FaFileLines, FaMagnifyingGlass, FaUserGraduate } from "react-icons/fa6";
import PageContainer from "@/components/PageContainer";
import Link from "next/link";
import { cookies } from 'next/headers';

export default async function ReportsPage() {
    const userCookie = cookies().get('user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    const userRole = user?.role || 'parent';

    let reports: any[] = [];
    let students: any[] = [];
    let error: string | null = null;

    try {
        // For admin, fetch all students for report generation
        if (userRole === 'admin') {
            students = await apiFetchServer('/students') || [];
        }
        reports = await apiFetchServer('/documents/all') || [];
    } catch (e) {
        error = "Unable to load data. Please ensure you are logged in.";
    }

    // For parent users - only show their child's reports, no management features
    if (userRole === 'parent') {
        return (
            <PageContainer
                title="Student Reports"
                subtitle="View your child's progress reports"
            >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {reports.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            No reports available for viewing.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {reports.map((report: any) => (
                                <div key={report.id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                                                <FaFileLines />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-700">{report.filename}</p>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(report.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="bg-slate-50 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-tight border border-slate-100 text-slate-600">
                                            {report.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PageContainer>
        );
    }

    // For Admin - show student list with Generate Report option
    if (userRole === 'admin') {
        return (
            <PageContainer
                title="Report Management"
                subtitle="Generate and manage reports for all students"
            >
                <div className="space-y-6">
                    {/* Student List for Report Generation */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">All Students</h3>
                            <p className="text-xs text-slate-500 mt-1">Click "Generate Report" to create a detailed report for any student</p>
                        </div>

                        {students.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No students found in the system.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {students.map((student: any) => (
                                    <div key={student.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center font-bold">
                                                {student.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{student.name}</p>
                                                <p className="text-xs text-slate-400">
                                                    UDID: <span className="font-mono text-slate-500">{student.udid?.substring(0, 8)}...</span>
                                                    <span className="mx-2 text-slate-300">|</span>
                                                    IPP: {student.ipp_number}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${student.active_status ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {student.active_status ? 'Active' : 'Inactive'}
                                            </span>
                                            <Link
                                                href={`/reports/generate?id=${student.id}`}
                                                className="px-4 py-2 bg-brand-600 text-white font-bold text-sm rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2"
                                            >
                                                <FaFileLines className="text-xs" />
                                                Generate Report
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Existing Reports */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Uploaded Documents</h3>
                        </div>
                        {reports.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No documents uploaded yet.
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Document</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Uploaded</th>
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
                                                <span className="bg-slate-50 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-tight border border-slate-100 text-slate-600">
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
                </div>
            </PageContainer>
        );
    }

    // For staff - simplified reports view (similar to admin but without full management)
    return (
        <PageContainer
            title="Reports"
            subtitle="Access student reports and documents"
        >
            <div className="space-y-6">
                {/* Student List for Report Access */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Student Reports</h3>
                                <p className="text-xs text-slate-500 mt-1">Generate or view reports for students</p>
                            </div>
                            <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg border border-brand-100">
                                Edit Access
                            </span>
                        </div>
                    </div>

                    {error ? (
                        <div className="p-8 text-center text-amber-600">{error}</div>
                    ) : reports.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            No reports available. Select a student from the dashboard to generate a report.
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
            </div>
        </PageContainer>
    );
}
