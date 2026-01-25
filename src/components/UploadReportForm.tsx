'use client';

import { useRef, useState } from 'react';
import { uploadReport } from '@/actions/upload-report-action';
import { FaCloudArrowUp } from 'react-icons/fa6';

export default function UploadReportForm({ studentId }: { studentId: number }) {
    const [isUploading, setIsUploading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    async function clientAction(formData: FormData) {
        setIsUploading(true);
        // Add student ID to formData
        formData.append('studentId', studentId.toString());

        const result = await uploadReport(formData);

        if (result?.success) {
            alert('Report uploaded successfully!');
            formRef.current?.reset();
        } else {
            alert('Upload failed: ' + (result?.error || 'Unknown error'));
        }
        setIsUploading(false);
    }

    return (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-bold text-brand-800 mb-4 flex items-center gap-2">
                <FaCloudArrowUp /> Upload New Report
            </h3>
            <form ref={formRef} action={clientAction} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Report Type</label>
                    <select name="type" className="w-full text-sm p-2 rounded border border-slate-300" required>
                        <option value="Screening">Screening</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="HalfYearly">Half Yearly</option>
                        <option value="Annual">Annual</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">File</label>
                    <input type="file" name="file" className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-100 file:text-brand-700 hover:file:bg-brand-200" required />
                </div>
                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-brand-600 text-white font-bold py-2 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 text-sm"
                >
                    {isUploading ? 'Uploading...' : 'Upload Report'}
                </button>
            </form>
        </div>
    );
}
