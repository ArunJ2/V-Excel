'use client';

import { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa6';
import EditModal from './EditModal';
import { updateUserAction, deleteUserAction } from '@/actions/record-actions';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    linked_student_id: number | null;
}

interface UserActionsProps {
    user: User;
    students: { id: number; name: string; ipp_number: string }[];
}

export default function UserActions({ user, students }: UserActionsProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        linked_student_id: user.linked_student_id || '',
        password: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const dataToSend: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                linked_student_id: formData.linked_student_id || null
            };

            if (formData.password) {
                dataToSend.password = formData.password;
            }

            const result = await updateUserAction(user.id, dataToSend);

            if (result?.error) {
                alert('Error: ' + result.error);
            } else {
                setIsEditOpen(false);
                window.location.reload();
            }
        } catch (error) {
            alert('Failed to update user');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsSaving(true);
        try {
            const result = await deleteUserAction(user.id);
            if (result?.error) {
                alert('Error: ' + result.error);
            } else {
                setIsDeleteOpen(false);
                window.location.reload();
            }
        } catch (error) {
            alert('Failed to delete user');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsEditOpen(true)}
                className="p-2 text-slate-400 hover:text-brand-600 transition-colors bg-white rounded-lg border border-slate-100 shadow-sm"
            >
                <FaPen className="text-xs" />
            </button>
            <button
                onClick={() => setIsDeleteOpen(true)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg border border-slate-100 shadow-sm"
            >
                <FaTrash className="text-xs" />
            </button>

            {/* Edit Modal */}
            <EditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit User Profile">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                            required
                        >
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="parent">Parent</option>
                        </select>
                    </div>

                    {formData.role === 'parent' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                                Linked Student
                            </label>
                            <select
                                value={formData.linked_student_id}
                                onChange={(e) => handleChange('linked_student_id', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                            >
                                <option value="">No linked student</option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.ipp_number})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                            New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span>
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsEditOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </EditModal>

            {/* Delete Confirmation Modal */}
            <EditModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete User">
                <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
                        <FaTrash className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Are you sure?</h3>
                    <p className="text-slate-600 mb-6">
                        You are about to delete <strong>{user.name}</strong>. This action cannot be undone.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setIsDeleteOpen(false)}
                            className="px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isSaving}
                            className="px-6 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSaving ? 'Deleting...' : 'Delete User'}
                        </button>
                    </div>
                </div>
            </EditModal>
        </>
    );
}
