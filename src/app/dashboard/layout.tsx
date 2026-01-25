import Sidebar from "@/components/Sidebar";
import { cookies } from 'next/headers';
import PageTransition from "@/components/PageTransition";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const userCookie = cookies().get('user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : { name: 'Guest', role: 'staff' };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
            <Sidebar name={user.name} role={user.role} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-slate-800">Student Profile</h2>
                        <div className="h-4 w-px bg-slate-300 mx-2"></div>
                        <span className="text-sm text-slate-500 font-medium">IPP-3211</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                            {user.role === 'admin' ? 'Full Access' : 'View Access'}
                        </span>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 scroll-smooth">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>
            </main>
        </div>
    );
}
