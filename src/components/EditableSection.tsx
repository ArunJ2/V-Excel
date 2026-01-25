'use client';

import { ReactNode } from 'react';
import EditSectionButton from './EditSectionButton';

interface EditableSectionProps {
    children: ReactNode;
    studentId: number;
    section: 'clinical_history' | 'milestones' | 'adl' | 'observations';
    currentData: any;
    title: ReactNode;
    canEdit?: boolean;
}

export default function EditableSection({
    children,
    studentId,
    section,
    currentData,
    title,
    canEdit = true
}: EditableSectionProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {title}
                </div>
                {canEdit && (
                    <EditSectionButton
                        studentId={studentId}
                        section={section}
                        currentData={currentData}
                    />
                )}
            </div>
            {children}
        </div>
    );
}
