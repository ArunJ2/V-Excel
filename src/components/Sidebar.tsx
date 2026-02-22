"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaChartPie, FaGraduationCap, FaFolderOpen, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { logout } from "@/actions/auth-actions";
import { usePathname } from "next/navigation";

interface SidebarProps {
    name: string;
    role: "admin" | "staff" | "parent";
}

export default function Sidebar({ name, role }: SidebarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => pathname.startsWith(path);

    // Close sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Close on outside click
    useEffect(() => {
        if (!mobileOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [mobileOpen]);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const navLinks = (
        <>
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={`flex-shrink-0 flex items-center px-4 py-3 rounded-xl font-medium border transition-all ${isActive('/dashboard') ? 'bg-brand-50 text-brand-700 border-brand-100' : 'text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-900'}`}>
                <FaChartPie className="w-5 text-center" /> <span className="ml-3">Dashboard</span>
            </Link>

            {role !== 'parent' && (
                <Link href="/student-info" onClick={() => setMobileOpen(false)} className={`flex-shrink-0 flex items-center px-4 py-3 rounded-xl font-medium border transition-all ${isActive('/student-info') ? 'bg-brand-50 text-brand-700 border-brand-100' : 'text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-900'}`}>
                    <FaGraduationCap className="w-5 text-center" /> <span className="ml-3">Student Info</span>
                </Link>
            )}

            {role !== 'parent' && (
                <Link href="/reports" onClick={() => setMobileOpen(false)} className={`flex-shrink-0 flex items-center px-4 py-3 rounded-xl font-medium border transition-all ${isActive('/reports') ? 'bg-brand-50 text-brand-700 border-brand-100' : 'text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-900'}`}>
                    <FaFolderOpen className="w-5 text-center" /> <span className="ml-3">Reports</span>
                </Link>
            )}

            {role === 'admin' && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className={`flex-shrink-0 flex items-center px-4 py-3 rounded-xl font-medium border transition-all ${isActive('/admin') ? 'bg-brand-50 text-brand-700 border-brand-100' : 'text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-900'}`}>
                    <div className="w-5 flex justify-center items-center h-5 bg-slate-800 text-white rounded text-[10px] font-bold">A</div>
                    <span className="ml-3">Admin Panel</span>
                </Link>
            )}

            {role === 'staff' && (
                <div className="mt-4 mx-2 p-3 bg-brand-50 border border-brand-100 rounded-xl">
                    <p className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Edit Access</p>
                    <p className="text-[9px] text-brand-600 mt-0.5">Full editing permissions</p>
                </div>
            )}
        </>
    );

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 z-30 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        V
                    </div>
                    <span className="font-bold text-slate-800 text-lg tracking-tight">V-Excel</span>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                    {mobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                </button>
            </div>

            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar - desktop always visible, mobile slide-out */}
            <aside
                ref={sidebarRef}
                className={`fixed md:static top-0 left-0 h-full w-72 md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="p-4 md:p-6 flex items-center justify-between md:justify-start border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            V
                        </div>
                        <span className="font-bold text-slate-800 text-lg tracking-tight">V-Excel</span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="md:hidden text-slate-500 hover:text-red-500">
                        <FaTimes />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navLinks}
                </nav>

                <div className="p-4 border-t border-slate-100">
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
        </>
    );
}
