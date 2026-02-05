'use client';

import { useState } from 'react';
import { FaPen } from 'react-icons/fa6';
import EditModal from './EditModal';
import { updateStudentProfile } from '@/actions/student-actions';

interface EditStudentProfileButtonProps {
    studentId: number;
    section: 'personal_info' | 'guardian_details' | 'clinical_info' | 'attendance' | 'quick_notes';
    currentData: any;
    userRole: string;
}

type FieldConfig = {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'date';
    options?: string[];
    min?: number;
    max?: number;
};

type SectionConfig = {
    title: string;
    fields: FieldConfig[];
};

const sectionConfig: Record<string, SectionConfig> = {
    personal_info: {
        title: 'Edit Personal Information',
        fields: [
            { name: 'udid', label: 'Unique Student ID (UDID)', type: 'text' },
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'dob', label: 'Date of Birth', type: 'date' },
            { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
            { name: 'blood_group', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        ]
    },
    guardian_details: {
        title: 'Edit Guardian Details',
        fields: [
            { name: 'parent_names', label: 'Parent/Guardian Names', type: 'text' },
            { name: 'parent_contact', label: 'Contact Number', type: 'text' },
            { name: 'address', label: 'Address', type: 'textarea' },
        ]
    },
    clinical_info: {
        title: 'Edit Clinical Information',
        fields: [
            { name: 'disability_type', label: 'Disability Type', type: 'select', options: ['Autism', 'ADHD', 'Cerebral Palsy', 'Down Syndrome', 'Learning Disability', 'Intellectual Disability', 'Multiple Disabilities', 'Other'] },
            { name: 'disability_detail', label: 'Disability Details', type: 'textarea' },
            { name: 'referral_doctor', label: 'Referral Doctor', type: 'text' },
            { name: 'therapist_assigned', label: 'Assigned Therapist', type: 'text' },
            { name: 'clinical_case_no', label: 'Clinical Case Number', type: 'text' },
            { name: 'active_status', label: 'Active Status', type: 'select', options: ['true', 'false'] },
        ]
    },
    attendance: {
        title: 'Edit Attendance',
        fields: [
            { name: 'days_present', label: 'Days Present', type: 'number', min: 0 },
            { name: 'days_absent', label: 'Days Absent', type: 'number', min: 0 },
        ]
    },
    quick_notes: {
        title: 'Edit Quick Notes',
        fields: [
            { name: 'quick_notes', label: 'Quick Notes', type: 'textarea' },
        ]
    }
};

export default function EditStudentProfileButton({ studentId, section, currentData, userRole }: EditStudentProfileButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState(() => {
        // Initialize form data based on section
        const data: any = {};
        const config = sectionConfig[section];
        config.fields.forEach(field => {
            if (field.name === 'dob' && currentData[field.name]) {
                // Format date for input
                const date = new Date(currentData[field.name]);
                data[field.name] = date.toISOString().split('T')[0];
            } else if (field.name === 'active_status') {
                data[field.name] = String(currentData[field.name]);
            } else {
                data[field.name] = currentData[field.name] ?? '';
            }
        });
        return data;
    });
    const [isSaving, setIsSaving] = useState(false);

    // Only admin and staff can edit
    if (userRole !== 'admin' && userRole !== 'staff') {
        return null;
    }

    const config = sectionConfig[section];

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Prepare data for submission
            const dataToSubmit: any = { ...formData };

            // Handle special field conversions
            if (dataToSubmit.active_status !== undefined) {
                dataToSubmit.active_status = dataToSubmit.active_status === 'true';
            }
            if (dataToSubmit.days_present !== undefined) {
                dataToSubmit.days_present = parseInt(dataToSubmit.days_present);
            }
            if (dataToSubmit.days_absent !== undefined) {
                dataToSubmit.days_absent = parseInt(dataToSubmit.days_absent);
            }

            const result = await updateStudentProfile(studentId, dataToSubmit);

            if (result?.error) {
                alert('Error: ' + result.error);
            } else {
                setIsOpen(false);
                window.location.reload();
            }
        } catch (error) {
            alert('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md"
                title="Edit"
            >
                <FaPen className="text-[10px]" />
            </button>

            <EditModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={config.title}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {config.fields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                                    {field.label}
                                </label>

                                {field.type === 'text' && (
                                    <input
                                        type="text"
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                    />
                                )}

                                {field.type === 'date' && (
                                    <input
                                        type="date"
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                    />
                                )}

                                {field.type === 'number' && (
                                    <input
                                        type="number"
                                        value={formData[field.name] ?? ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        min={field.min}
                                        max={field.max}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                    />
                                )}

                                {field.type === 'textarea' && (
                                    <textarea
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                                    />
                                )}

                                {field.type === 'select' && (
                                    <select
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                                    >
                                        <option value="">Select...</option>
                                        {field.options?.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt === 'true' ? 'Active' : opt === 'false' ? 'Inactive' : opt}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
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
        </>
    );
}
