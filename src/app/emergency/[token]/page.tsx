import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getEmergencyInfo(token: string) {
    try {
        const res = await fetch(`${API_URL}/public/emergency/${token}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        return null;
    }
}

export default async function EmergencyPage({ params }: { params: { token: string } }) {
    const data = await getEmergencyInfo(params.token);

    if (!data) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Emergency Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Emergency Information</h1>
                            <p className="text-red-100 text-sm">For emergency use only</p>
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white p-8 rounded-b-2xl shadow-2xl border border-slate-200">
                    {/* Name */}
                    <div className="mb-8 text-center border-b border-slate-100 pb-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Student Name</p>
                        <h2 className="text-3xl font-bold text-slate-800">{data.name}</h2>
                    </div>

                    {/* Emergency Details Grid */}
                    <div className="space-y-6">
                        {/* Blood Group - Highlighted */}
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Blood Group</p>
                            <p className="text-2xl font-bold text-red-700">{data.blood_group || 'Not Specified'}</p>
                        </div>

                        {/* Center */}
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Center / Facility</p>
                            <p className="text-lg font-semibold text-slate-800">{data.center_name || 'V-Excel Foundation'}</p>
                        </div>

                        {/* Address */}
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Residential Address</p>
                            <p className="text-lg font-semibold text-slate-800">{data.address || 'Not Available'}</p>
                        </div>

                        {/* Parent Contact */}
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Parent/Guardian Contact</p>
                            <a href={`tel:${data.parent_contact}`} className="text-xl font-bold text-emerald-700 hover:underline">
                                {data.parent_contact || 'Not Available'}
                            </a>
                        </div>

                        {/* Parent Email */}
                        {data.parent_email && (
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Parent/Guardian Email</p>
                                <a href={`mailto:${data.parent_email}`} className="text-lg font-bold text-blue-700 hover:underline">
                                    {data.parent_email}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-xs text-slate-400 text-center">
                            This information is strictly for emergency purposes only.
                            <br />
                            No other personal or medical data is shared through this link.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-xs text-slate-400">
                        Powered by <span className="font-bold">V-Excel Foundation</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
