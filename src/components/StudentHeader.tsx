"use client";

import { FaCakeCandles, FaDroplet, FaLocationDot, FaUserGroup, FaCloudArrowUp, FaPuzzlePiece, FaNotesMedical } from "react-icons/fa6";

interface StudentHeaderProps {
    role: "staff" | "parent";
    student: {
        name: string;
        dob: string;
        blood_group: string;
        address: string;
        parent_names: string;
        parent_contact: string;
        disability_type?: string;
        referral_doctor?: string;
        active_status?: boolean;
    };
}

export default function StudentHeader({ role, student }: StudentHeaderProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col md:flex-row gap-6 relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-brand-100 to-transparent rounded-bl-full opacity-60"></div>

            {/* Photo */}
            <div className="relative flex-shrink-0 mx-auto md:mx-0 cursor-pointer group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-md bg-gray-200 ring-4 ring-white">
                    <img src="https://ui-avatars.com/api/?name=Rahul+S&background=0ea5e9&color=fff&size=128"
                        className="w-full h-full object-cover transition-all duration-500"
                        alt="Student" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                    Active
                </div>
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{student.name}</h1>
                        <div className="mt-2 text-sm text-slate-600 flex flex-wrap gap-x-4 gap-y-1 justify-center md:justify-start">
                            <span className="flex items-center gap-1"><FaCakeCandles className="text-slate-400" /> DOB: {student.dob}</span>
                            <span className="flex items-center gap-1"><FaDroplet className="text-slate-400" /> Blood: <span className="font-bold text-red-600 ml-1">{student.blood_group}</span></span>
                            <span className="flex items-center gap-1"><FaLocationDot className="text-slate-400" /> {student.address}</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-600 flex items-center justify-center md:justify-start gap-1">
                            <FaUserGroup className="text-slate-400" />
                            <span className="font-medium mr-1">Parents:</span> {student.parent_names} ({student.parent_contact})
                        </div>
                    </div>

                    {/* Action Buttons - Only for Staff */}
                    {role === 'staff' && (
                        <div className="mt-4 md:mt-0 flex gap-2 justify-center md:justify-end">
                            <button
                                onClick={() => {
                                    document.querySelector('#upload-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                            >
                                <FaCloudArrowUp /> Upload Report
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-2">
                        <FaPuzzlePiece /> Autism Spectrum
                    </span>
                    <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100 flex items-center gap-2">
                        <FaNotesMedical /> H/o Seizures
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200">
                        Referred By: Dr. R. Kumar
                    </span>
                </div>
            </div>
        </div>
    );
}
