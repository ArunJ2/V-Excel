import { studentApi } from "@/lib/api-server";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import PageContainer from "@/components/PageContainer";

export default async function StudentInfoPage() {
    const students = await studentApi.getAll();

    const addBtn = (
        <Link href="/admin/add-student" className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
            Add New Student
        </Link>
    );

    return (
        <PageContainer
            title="Student Directory"
            subtitle="Browse and manage all registered student profiles"
            action={addBtn}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student: any) => (
                    <div key={student.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                                {student.name ? student.name.substring(0, 1) : 'S'}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{student.name}</h3>
                                <p className="text-xs text-slate-500 font-medium tracking-tight">{student.ipp_number}</p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-slate-400">Disability</span>
                                <span className="text-slate-600 font-semibold">{student.disability_type || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-slate-400">Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${student.active_status ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {student.active_status ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>
                        </div>

                        <Link
                            href={`/dashboard?id=${student.id}`}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm"
                        >
                            View Profile <FaArrowRight className="text-xs" />
                        </Link>
                    </div>
                ))}
            </div>
        </PageContainer>
    );
}
