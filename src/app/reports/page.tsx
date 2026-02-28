import { apiFetchServer } from "@/lib/api-server";
import { FaFileLines } from "react-icons/fa6";
import PageContainer from "@/components/PageContainer";
import Link from "next/link";
import { cookies } from 'next/headers';
import ReportTable from "@/components/ReportTable";

export default async function ReportsPage() {
    const userCookie = cookies().get('user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    const userRole = user?.role || 'parent';

    let reports: any[] = [];
    let students: any[] = [];
    let error: string | null = null;

    try {
        if (userRole === 'admin' || userRole === 'staff') {
            students = await apiFetchServer('/students') || [];
        }
        reports = await apiFetchServer('/documents/all') || [];
    } catch (e) {
        error = "Unable to load data. Please ensure you are logged in.";
    }

    // For parent users
    if (userRole === 'parent') {
        return (
            <PageContainer
                title="Student Reports"
                subtitle="View your child's progress reports"
            >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {reports.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center text-slate-500">
                            No reports available for viewing.
                        </div>
                    ) : (
                        <ReportTable reports={reports} userRole={userRole} />
                    )}
                </div>
            </PageContainer>
        );
    }

    // For Admin
    if (userRole === 'admin') {
        return (
            <PageContainer
                title="Report Management"
                subtitle="Generate and manage reports for all students"
            >
                <div className="space-y-4 sm:space-y-6">
                    {/* Student List */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 sm:p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">All Students</h3>
                            <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">Click &quot;Generate Report&quot; to create a detailed report for any student</p>
                        </div>

                        {students.length === 0 ? (
                            <div className="p-6 sm:p-8 text-center text-slate-500">
                                No students found in the system.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {students.map((student: any) => (
                                    <div key={student.id} className="p-3 sm:p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
                                                {student.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-800 text-sm sm:text-base">{student.name}</p>
                                                <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                                                    UDID: <span className="font-mono text-slate-500">{student.udid?.substring(0, 8)}...</span>
                                                    <span className="mx-1 sm:mx-2 text-slate-300">|</span>
                                                    IPP: {student.ipp_number}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 pl-[52px] sm:pl-0">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${student.active_status ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {student.active_status ? 'Active' : 'Inactive'}
                                            </span>
                                            <Link
                                                href={`/reports/generate?id=${student.id}`}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-600 text-white font-bold text-xs sm:text-sm rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-1.5 sm:gap-2"
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

                    {/* Documents Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 sm:p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">All Documents</h3>
                            <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">Preview, download, or delete reports</p>
                        </div>
                        <ReportTable reports={reports} userRole={userRole} />
                    </div>
                </div>
            </PageContainer>
        );
    }

    // For staff
    return (
        <PageContainer
            title="Reports"
            subtitle="Access student reports and documents"
        >
            <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 sm:p-4 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Student Reports</h3>
                                <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">Preview, download, or delete reports</p>
                            </div>
                            <span className="px-2 sm:px-3 py-1 bg-brand-50 text-brand-700 text-[10px] sm:text-xs font-bold rounded-lg border border-brand-100">
                                Edit Access
                            </span>
                        </div>
                    </div>

                    {error ? (
                        <div className="p-6 sm:p-8 text-center text-amber-600">{error}</div>
                    ) : (
                        <ReportTable reports={reports} userRole={userRole} />
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
