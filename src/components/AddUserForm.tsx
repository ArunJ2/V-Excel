'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaArrowLeft, FaEye, FaEyeSlash, FaIdCard, FaTriangleExclamation } from 'react-icons/fa6';
import Link from 'next/link';
import { createUserAction } from '@/actions/user-actions';

export default function AddUserForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState('staff');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Validate UDID is required for parent accounts
        if (selectedRole === 'parent' && !data.linked_student_udid) {
            setError('Student UDID is required for parent accounts. Please enter a valid UDID.');
            setIsLoading(false);
            return;
        }

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
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <FaTriangleExclamation className="text-xs" />
                        </div>
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

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">System Role</label>
                        <select
                            name="role"
                            required
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 transition-all font-bold"
                        >
                            <option value="staff">Staff / Teacher</option>
                            <option value="admin">Administrator</option>
                            <option value="parent">Parent</option>
                        </select>
                    </div>

                    {/* UDID field - Required for parent accounts */}
                    {selectedRole === 'parent' && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                <FaIdCard className="text-brand-500" />
                                Student UDID <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="linked_student_udid"
                                required
                                placeholder="Enter student's unique UDID"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-mono"
                            />
                            <p className="text-[10px] text-slate-500 px-1 mt-1">
                                The UDID can be found on the student's profile page. This field is mandatory for parent accounts.
                            </p>
                        </div>
                    )}
                </div>

                <div className={`border p-4 rounded-xl ${selectedRole === 'parent' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                    {selectedRole === 'parent' ? (
                        <div className="space-y-2">
                            <p className="text-xs text-rose-700 font-bold flex items-center gap-2">
                                <FaTriangleExclamation />
                                Parent Account Restrictions
                            </p>
                            <ul className="text-[10px] text-rose-600 font-medium space-y-1 list-disc pl-4">
                                <li>View-only access to assigned student information</li>
                                <li><strong>No access</strong> to Plans & Reports section</li>
                                <li>Cannot upload, edit, or manage any data</li>
                                <li>Student UDID is mandatory and must be valid</li>
                            </ul>
                        </div>
                    ) : selectedRole === 'staff' ? (
                        <div className="space-y-2">
                            <p className="text-xs text-amber-700 font-bold">Staff Access: Edit Mode</p>
                            <ul className="text-[10px] text-amber-600 font-medium space-y-1 list-disc pl-4">
                                <li>Full edit access to student profiles and clinical data</li>
                                <li>Can update attendance, progress, and observations</li>
                                <li>Access to reports and document uploads</li>
                            </ul>
                        </div>
                    ) : (
                        <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                            <span className="uppercase">Administrator:</span> Full system access including user management, all students, and system settings.
                        </p>
                    )}
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
