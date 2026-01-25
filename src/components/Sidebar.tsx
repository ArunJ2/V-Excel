"use client";

import Link from "next/link";
import { FaChartPie, FaGraduationCap, FaFolderOpen, FaSignOutAlt } from "react-icons/fa";
import { logout } from "@/actions/auth-actions";
import { usePathname } from "next/navigation";

interface SidebarProps {
    name: string;
    role: "admin" | "staff" | "parent";
}

export default function Sidebar({ name, role }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-full min-h-screen md:min-h-0">
            <div className="p-4 md:p-6 flex items-center justify-between md:justify-start border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        V
                    </div>
                    <span className="font-bold text-slate-800 text-lg tracking-tight">V-Excel</span>
                </div>
                <button onClick={() => logout()} className="md:hidden text-slate-500 hover:text-red-500">
                    <FaSignOutAlt />
                </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-x-auto md:overflow-visible flex md:block no-scrollbar">
                <Link href="/dashboard" className={`flex-shrink-0 flex items-center px-4 py-3 rounded-xl font-medium border transition-all mr-2 md:mr-0 ${isActive('/dashboard') ? 'bg-brand-50 text-brand-700 border-brand-100' : 'text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-900'}`}>
                    <FaChartPie className="w-5 text-center" /> <span className="ml-3">Dashboard</span>
                </Link>

                {role !== 'parent' && (
                    <Link href="/student-info" className={`flex-shrink-0 flex items-center px-4 py-3 rounded-xl font-medium border transition-all mr-2 md:mr-0 ${isActive('/student-info') ? 'bg-brand-50 text-brand-700 border-brand-100' : 'text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-900'}`}>
                        <FaGraduationCap className="w-5 text-center" /> <span className="ml-3">Student Info</span>
                    </Link>
                )}

                <Link href="/reports" className={`flex-shrink-0 flex items-center px-4 py-3 rounded-xl font-medium border transition-all ${isActive('/reports') ? 'bg-brand-50 text-brand-700 border-brand-100' : 'text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-900'}`}>
                    <FaFolderOpen className="w-5 text-center" /> <span className="ml-3">Reports</span>
                </Link>

                {role === 'admin' && (
                    <Link href="/admin" className={`flex-shrink-0 flex items-center px-4 py-3 rounded-xl font-medium border transition-all ${isActive('/admin') ? 'bg-brand-50 text-brand-700 border-brand-100' : 'text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-900'}`}>
                        <div className="w-5 flex justify-center items-center h-5 bg-slate-800 text-white rounded text-[10px] font-bold">A</div>
                        <span className="ml-3">Admin Panel</span>
                    </Link>
                )}
            </nav>

            <div className="p-4 border-t border-slate-100 hidden md:block">
                <div className="flex items-center gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                        {name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
                        <p className="text-xs text-slate-500 truncate capitalize">{role}</p>
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                    <FaSignOutAlt className="mr-2" /> Logout
                </button>
            </div>
        </aside>
    );
}
