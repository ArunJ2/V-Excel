import { authApi, studentApi } from "@/lib/api-server";
import { FaUserPlus, FaUserShield, FaUserGroup } from "react-icons/fa6";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import UserActions from "@/components/UserActions";

export default async function AdminPage() {
    const users = await authApi.getAllUsers();
    const students = await studentApi.getAll();

    const addBtn = (
        <Link href="/admin/add-user" className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-sm">
            <FaUserPlus className="text-sm" /> Add New User
        </Link>
    );

    return (
        <PageContainer
            title="Admin Panel"
            subtitle="Manage portal users and system access"
            action={addBtn}
        >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:border-brand-200">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl">
                        <FaUserShield />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admins</p>
                        <p className="text-2xl font-bold text-slate-800">{users.filter((u: any) => u.role === 'admin').length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:border-indigo-200">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                        <FaUserGroup />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff / Teachers</p>
                        <p className="text-2xl font-bold text-slate-800">{users.filter((u: any) => u.role === 'staff').length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:border-emerald-200">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                        <FaUserGroup />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parents</p>
                        <p className="text-2xl font-bold text-slate-800">{users.filter((u: any) => u.role === 'parent').length}</p>
                    </div>
                </div>
            </div>

            {/* User List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="font-bold text-slate-800 tracking-tight">System Users</h2>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-white px-2 py-1 rounded border border-slate-100">
                        {users.length} Total Users
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Linked Student</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-slate-700">{user.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${user.role === 'admin' ? 'bg-slate-800 text-white shadow-sm' :
                                            user.role === 'staff' ? 'bg-indigo-100 text-indigo-700' :
                                                'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 italic">
                                        {user.linked_student_id ?
                                            students.find((s: any) => s.id === user.linked_student_id)?.name || `ID: ${user.linked_student_id}`
                                            : 'None'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 font-medium">
                                        {new Date(user.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <UserActions user={user} students={students} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageContainer>
    );
}
