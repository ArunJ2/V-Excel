'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa6';
import Link from 'next/link';
import { createUserAction } from '@/actions/user-actions';

export default function AddUserForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await createUserAction(data);

            if (res.error) {
                setError(res.error);
                return;
            }

            alert('User created successfully!');
            router.push('/admin');
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-lg">
                        <FaUserPlus />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Add New User</h2>
                        <p className="text-xs text-slate-500 font-medium tracking-tight">Create staff or parent accounts</p>
                    </div>
                </div>
                <Link href="/admin" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <FaArrowLeft />
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">!</div>
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                        <input name="name" required placeholder="User's Full Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 transition-all font-medium" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                        <input name="email" type="email" required placeholder="email@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 transition-all font-medium" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Min 6 characters"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 transition-all font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">System Role</label>
                            <select name="role" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 transition-all font-bold">
                                <option value="staff">Staff / Teacher</option>
                                <option value="admin">Administrator</option>
                                <option value="parent">Parent</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Linked Student ID</label>
                            <input name="linked_student_id" type="number" placeholder="Optional" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 transition-all font-medium" />
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                        <span className="uppercase">Note:</span> Staff can view all students and clinical data. Parents can ONLY view information for their linked student.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition-all disabled:opacity-50"
                >
                    {isLoading ? 'Creating Account...' : 'Create User Account'}
                </button>
            </form>
        </div>
    );
}
