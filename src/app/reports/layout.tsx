import Sidebar from "@/components/Sidebar";
import { cookies } from 'next/headers';
import PageTransition from "@/components/PageTransition";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
    const userCookie = cookies().get('user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : { name: 'Guest', role: 'admin' };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden print:h-auto print:overflow-visible print:block">
            <div className="print:hidden">
                <Sidebar name={user.name} role={user.role} />
            </div>
            <main className="flex-1 flex flex-col h-full overflow-hidden relative print:block print:h-auto print:overflow-visible">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 scroll-smooth print:p-0 print:bg-white print:overflow-visible">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>
            </main>
        </div>
    );
}
