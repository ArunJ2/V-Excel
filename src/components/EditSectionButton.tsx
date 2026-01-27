'use client';

import { useState } from 'react';
import { FaPen } from 'react-icons/fa6';
import EditModal from './EditModal';
import { updateClinicalHistory, updateMilestones, updateADL, updateObservations } from '@/actions/record-actions';

interface EditButtonProps {
    studentId: number;
    section: 'clinical_history' | 'milestones' | 'adl' | 'observations';
    currentData: any;
    label?: string;
}

type FieldConfig = {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox';
    options?: string[];
};

type SectionConfig = {
    title: string;
    fields: FieldConfig[];
};

const sectionConfig: Record<string, SectionConfig> = {
    clinical_history: {
        title: 'Edit Family & Medical History',
        fields: [
            { name: 'siblings_details', label: 'Siblings Details', type: 'text' },
            { name: 'family_structure', label: 'Family Structure', type: 'select', options: ['Nuclear Family', 'Joint Family', 'Single Parent'] },
            { name: 'home_language', label: 'Home Language', type: 'text' },
            { name: 'consanguinity', label: 'Consanguinity', type: 'checkbox' },
            { name: 'pregnancy_duration', label: 'Pregnancy Duration', type: 'select', options: ['Full Term', 'Pre-term', 'Post-term'] },
            { name: 'delivery_nature', label: 'Delivery Type', type: 'select', options: ['Normal', 'C-Section', 'Assisted'] },
            { name: 'birth_weight', label: 'Birth Weight', type: 'text' },
            { name: 'birth_cry', label: 'Birth Cry', type: 'select', options: ['Immediate', 'Delayed', 'Absent'] },
            { name: 'history_seizures', label: 'History of Seizures', type: 'checkbox' },
            { name: 'history_respiratory', label: 'Respiratory Issues', type: 'checkbox' },
            { name: 'current_medications', label: 'Current Medications', type: 'textarea' },
            { name: 'allergies', label: 'Allergies', type: 'text' },
            { name: 'age_disability_noticed', label: 'Age Disability Noticed', type: 'text' },
        ]
    },
    milestones: {
        title: 'Edit Developmental Milestones',
        fields: [
            { name: 'social_smile', label: 'Social Smile', type: 'select', options: ['Normal', 'Delayed', 'N/A'] },
            { name: 'neck_control', label: 'Neck Control', type: 'select', options: ['Normal', 'Delayed', 'N/A'] },
            { name: 'sitting', label: 'Sitting', type: 'select', options: ['Normal', 'Delayed', 'N/A'] },
            { name: 'crawling', label: 'Crawling', type: 'select', options: ['Normal', 'Delayed', 'N/A'] },
            { name: 'standing', label: 'Standing', type: 'select', options: ['Normal', 'Delayed', 'N/A'] },
            { name: 'walking', label: 'Walking', type: 'select', options: ['Normal', 'Delayed', 'N/A'] },
            { name: 'speech_initiation', label: 'Speech Initiation', type: 'select', options: ['Normal', 'Delayed', 'N/A'] },
        ]
    },
    adl: {
        title: 'Edit Daily Living Skills',
        fields: [
            { name: 'eating', label: 'Eating', type: 'select', options: ['Independent', 'Needs Assistance', 'Dependent'] },
            { name: 'dressing', label: 'Dressing', type: 'select', options: ['Independent', 'Needs Assistance', 'Dependent'] },
            { name: 'toileting', label: 'Toileting', type: 'select', options: ['Independent', 'Partially Independent', 'Dependent'] },
        ]
    },
    observations: {
        title: 'Edit Clinical Observations',
        fields: [
            { name: 'general_appearance', label: 'General Appearance', type: 'textarea' },
            { name: 'psychomotor_skills', label: 'Psychomotor Skills', type: 'textarea' },
            { name: 'sensory_issues', label: 'Sensory Issues', type: 'textarea' },
            { name: 'cognition_memory', label: 'Cognition & Memory', type: 'textarea' },
            { name: 'communication_expressive', label: 'Expressive Communication', type: 'textarea' },
            { name: 'communication_receptive', label: 'Receptive Communication', type: 'textarea' },
            { name: 'social_interaction', label: 'Social Interaction', type: 'textarea' },
        ]
    }
};

export default function EditSectionButton({ studentId, section, currentData, label }: EditButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState(currentData || {});
    const [isSaving, setIsSaving] = useState(false);

    const config = sectionConfig[section];

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let result;
            switch (section) {
                case 'clinical_history':
                    result = await updateClinicalHistory(studentId, formData);
                    break;
                case 'milestones':
                    result = await updateMilestones(studentId, formData);
                    break;
                case 'adl':
                    result = await updateADL(studentId, formData);
                    break;
                case 'observations':
                    result = await updateObservations(studentId, formData);
                    break;
            }

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
                className="p-2 text-slate-400 hover:text-brand-600 transition-colors bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md"
                title="Edit"
            >
                <FaPen className="text-xs" />
            </button>

            <EditModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={config.title}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {config.fields.map((field) => (
                            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
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
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                )}

                                {field.type === 'checkbox' && (
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData[field.name] || false}
                                            onChange={(e) => handleChange(field.name, e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                        />
                                        <span className="text-sm text-slate-600">Yes</span>
                                    </label>
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
