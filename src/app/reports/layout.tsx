import Sidebar from "@/components/Sidebar";
import { cookies } from 'next/headers';
import PageTransition from "@/components/PageTransition";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
    const userCookie = cookies().get('user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : { name: 'Guest', role: 'admin' };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
            <Sidebar name={user.name} role={user.role} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 scroll-smooth">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>
            </main>
        </div>
    );
}
