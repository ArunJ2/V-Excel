import Link from "next/link";
import { FaChalkboardTeacher, FaUserFriends } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white z-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-900 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 z-0 animate-pulse-slow"></div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        {/* Branding */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto bg-white rounded-xl flex items-center justify-center text-brand-600 text-3xl font-bold shadow-lg mb-4">
            V
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">V-Excel Educational Trust</h1>
          <p className="text-slate-300 mt-2 text-lg">Student Data & Intervention Portal</p>
        </div>

        {/* Access Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* STAFF ACCESS */}
          <Link href="/login" className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-100 text-brand-700 text-[10px] font-bold px-3 py-1 rounded-bl-lg">
              Admin / Teacher
            </div>
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 text-3xl mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <FaChalkboardTeacher />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Staff Portal</h3>
            <p className="text-sm text-slate-500 mb-6">Manage IEPs, update milestones, and upload screening reports.</p>
            <span className="px-6 py-3 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors w-full border border-slate-200">
              Secure Login
            </span>
          </Link>

          {/* PARENT PORTAL */}
          <Link href="/login" className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-bl-lg">
              Family
            </div>
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-3xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FaUserFriends />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Parent Portal</h3>
            <p className="text-sm text-slate-500 mb-6">Track your child&apos;s progress, view approved reports, and schedules.</p>
            <span className="px-6 py-3 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors w-full border border-slate-200">
              View Profile
            </span>
          </Link>
        </div>
        <p className="text-center text-slate-400 text-xs mt-12">© 2025 V-Excel Educational Trust • Mandaveli Office</p>
      </div>
    </div>
  );
}
