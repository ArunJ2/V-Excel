'use client';

import { useRef, useState } from 'react';
import { FaPrint, FaDownload, FaArrowLeft, FaUser, FaHospital, FaBaby, FaHouse, FaEye, FaChartLine } from 'react-icons/fa6';
import Link from 'next/link';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface StudentReportProps {
    studentData: any;
    clinicalHistory: any;
    milestones: any;
    adl: any;
    observations: any;
    reports: any[];
}

export default function StudentReportView({
    studentData,
    clinicalHistory,
    milestones,
    adl,
    observations,
    reports
}: StudentReportProps) {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    };

    // Format date helper
    const formatDate = (date: string | Date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Calculate age
    const calculateAge = (dob: string) => {
        if (!dob) return 'N/A';
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} years`;
    };

    // Milestones chart data
    const milestonesChartData = {
        labels: ['Social Smile', 'Neck Control', 'Sitting', 'Crawling', 'Standing', 'Walking', 'Speech'],
        datasets: [{
            label: 'Milestone Status',
            data: [
                milestones?.social_smile === 'Normal' ? 100 : milestones?.social_smile === 'Delayed' ? 50 : 0,
                milestones?.neck_control === 'Normal' ? 100 : milestones?.neck_control === 'Delayed' ? 50 : 0,
                milestones?.sitting === 'Normal' ? 100 : milestones?.sitting === 'Delayed' ? 50 : 0,
                milestones?.crawling === 'Normal' ? 100 : milestones?.crawling === 'Delayed' ? 50 : 0,
                milestones?.standing === 'Normal' ? 100 : milestones?.standing === 'Delayed' ? 50 : 0,
                milestones?.walking === 'Normal' ? 100 : milestones?.walking === 'Delayed' ? 50 : 0,
                milestones?.speech_initiation === 'Normal' ? 100 : milestones?.speech_initiation === 'Delayed' ? 50 : 0,
            ],
            backgroundColor: [
                'rgba(34, 197, 94, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(168, 85, 247, 0.7)',
                'rgba(249, 115, 22, 0.7)',
                'rgba(236, 72, 153, 0.7)',
                'rgba(20, 184, 166, 0.7)',
                'rgba(245, 158, 11, 0.7)',
            ],
            borderColor: [
                'rgb(34, 197, 94)',
                'rgb(59, 130, 246)',
                'rgb(168, 85, 247)',
                'rgb(249, 115, 22)',
                'rgb(236, 72, 153)',
                'rgb(20, 184, 166)',
                'rgb(245, 158, 11)',
            ],
            borderWidth: 2,
        }]
    };

    // ADL Progress data
    const adlChartData = {
        labels: ['Eating', 'Dressing', 'Toileting'],
        datasets: [{
            data: [
                adl?.eating === 'Independent' ? 100 : adl?.eating === 'Needs Assistance' ? 50 : 25,
                adl?.dressing === 'Independent' ? 100 : adl?.dressing === 'Needs Assistance' ? 50 : 25,
                adl?.toileting === 'Independent' ? 100 : adl?.toileting === 'Partially Independent' ? 50 : 25,
            ],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)',
            ],
            borderWidth: 0,
        }]
    };

    // Attendance & Progress chart
    const progressChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Progress Score',
            data: [40, 45, 42, 55, 60, 68],
            fill: true,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderColor: 'rgb(99, 102, 241)',
            tension: 0.4,
            pointBackgroundColor: 'rgb(99, 102, 241)',
        }]
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Control Bar - Hidden in print */}
            <div className="print:hidden sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/dashboard?id=${studentData.id}`}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <FaArrowLeft />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">Student Report</h1>
                            <p className="text-xs text-slate-500">{studentData.name} • {studentData.ipp_number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            disabled={isPrinting}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
                        >
                            <FaPrint className="text-sm" />
                            {isPrinting ? 'Preparing...' : 'Print / Save PDF'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Content */}
            <div ref={reportRef} className="max-w-[1200px] mx-auto p-6 print:p-0 print:max-w-none print:w-full print:m-0 print:overflow-visible">
                <div className="bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden print:overflow-visible print:w-full">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white p-8 print:p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">V-Excel Foundation</h1>
                                <p className="text-brand-100 text-sm">Comprehensive Student Assessment Report</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-brand-100">Report Generated</p>
                                <p className="font-bold">{formatDate(new Date())}</p>
                            </div>
                        </div>
                    </div>

                    {/* Student Basic Info */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                                <FaUser />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Student Profile</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Full Name</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">IPP Number</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.ipp_number}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date of Birth</p>
                                <p className="text-sm font-semibold text-slate-800">{formatDate(studentData.dob)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Age</p>
                                <p className="text-sm font-semibold text-slate-800">{calculateAge(studentData.dob)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Gender</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.gender || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Blood Group</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.blood_group || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status</p>
                                <span className={`inline-block text-xs font-bold px-2 py-1 rounded ${studentData.active_status ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {studentData.active_status ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Attendance</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.attendance ?? 100}%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Parent/Guardian</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.parent_names || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Contact</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.parent_contact || 'N/A'}</p>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Address</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Information */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                                <FaHospital />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Clinical Information</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Disability Type</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.disability_type || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Clinical Case No.</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.clinical_case_no || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Referral Doctor</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.referral_doctor || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Assigned Therapist</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.therapist_assigned || 'N/A'}</p>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Disability Details</p>
                                <p className="text-sm font-semibold text-slate-800">{studentData.disability_detail || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Medical History */}
                        {clinicalHistory && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-bold text-slate-700 mb-4">Medical History</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Pregnancy Duration</p>
                                        <p className="text-sm font-semibold text-slate-700">{clinicalHistory.pregnancy_duration || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Type</p>
                                        <p className="text-sm font-semibold text-slate-700">{clinicalHistory.delivery_nature || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Birth Weight</p>
                                        <p className="text-sm font-semibold text-slate-700">{clinicalHistory.birth_weight || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Birth Cry</p>
                                        <p className="text-sm font-semibold text-slate-700">{clinicalHistory.birth_cry || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Family Structure</p>
                                        <p className="text-sm font-semibold text-slate-700">{clinicalHistory.family_structure || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Home Language</p>
                                        <p className="text-sm font-semibold text-slate-700">{clinicalHistory.home_language || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Seizure History</p>
                                        <p className="text-sm font-semibold text-slate-700">{clinicalHistory.history_seizures ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Current Medications</p>
                                        <p className="text-sm font-semibold text-slate-700">{clinicalHistory.current_medications || 'None'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Developmental Milestones with Chart */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                <FaBaby />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Developmental Milestones</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Social Smile', value: milestones?.social_smile },
                                    { label: 'Neck Control', value: milestones?.neck_control },
                                    { label: 'Sitting', value: milestones?.sitting },
                                    { label: 'Crawling', value: milestones?.crawling },
                                    { label: 'Standing', value: milestones?.standing },
                                    { label: 'Walking', value: milestones?.walking },
                                    { label: 'Speech Initiation', value: milestones?.speech_initiation },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                                        <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded ${item.value === 'Normal' ? 'bg-green-100 text-green-700' :
                                            item.value === 'Delayed' ? 'bg-amber-100 text-amber-700' :
                                                'bg-slate-100 text-slate-500'
                                            }`}>
                                            {item.value || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="h-64 print:h-48">
                                <Bar
                                    data={milestonesChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false }
                                        },
                                        scales: {
                                            y: {
                                                max: 100,
                                                ticks: {
                                                    callback: (value) => value === 100 ? 'Normal' : value === 50 ? 'Delayed' : 'N/A'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Daily Living Skills with Chart */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                                <FaHouse />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Daily Living Skills (ADL)</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                {[
                                    { label: 'Eating', value: adl?.eating, desc: 'Ability to feed oneself independently' },
                                    { label: 'Dressing', value: adl?.dressing, desc: 'Ability to dress and undress independently' },
                                    { label: 'Toileting', value: adl?.toileting, desc: 'Ability to use toilet facilities' },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{item.label}</p>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${item.value === 'Independent' ? 'bg-green-100 text-green-700' :
                                                item.value?.includes('Partial') || item.value?.includes('Assistance') ? 'bg-amber-100 text-amber-700' :
                                                    item.value === 'Dependent' ? 'bg-red-100 text-red-700' :
                                                        'bg-slate-100 text-slate-500'
                                                }`}>
                                                {item.value || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.value === 'Independent' ? 'bg-green-500 w-full' :
                                                    item.value?.includes('Partial') || item.value?.includes('Assistance') ? 'bg-amber-500 w-1/2' :
                                                        item.value === 'Dependent' ? 'bg-red-500 w-1/4' : 'bg-slate-300 w-0'
                                                    }`}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-64 flex items-center justify-center print:h-48">
                                <div className="w-48 h-48">
                                    <Doughnut
                                        data={adlChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    labels: { boxWidth: 12, font: { size: 10 } }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Observations */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FaEye />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Clinical Observations</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: 'General Appearance', value: observations?.general_appearance },
                                { label: 'Psychomotor Skills', value: observations?.psychomotor_skills },
                                { label: 'Sensory Issues', value: observations?.sensory_issues },
                                { label: 'Cognition & Memory', value: observations?.cognition_memory },
                                { label: 'Expressive Communication', value: observations?.communication_expressive },
                                { label: 'Receptive Communication', value: observations?.communication_receptive },
                                { label: 'Social Interaction', value: observations?.social_interaction },
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{item.label}</p>
                                    <p className="text-sm text-slate-700">{item.value || 'Not recorded'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="p-8 print:p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <FaChartLine />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Progress Tracking</h2>
                        </div>

                        <div className="h-64 print:h-48">
                            <Line
                                data={progressChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false }
                                    },
                                    scales: {
                                        y: { min: 0, max: 100 }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Quick Notes */}
                    {(studentData.quick_notes || studentData.disability_detail) && (
                        <div className="p-8 print:p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Additional Notes</h2>
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {studentData.quick_notes || studentData.disability_detail}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-8 print:p-6 bg-slate-50">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <div>
                                <p className="font-bold text-slate-600">V-Excel Foundation</p>
                                <p>Empowering Every Child's Potential</p>
                            </div>
                            <div className="text-right">
                                <p>Report ID: RPT-{studentData.id}-{Date.now().toString(36).toUpperCase()}</p>
                                <p>Page 1 of 1</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                }
            `}</style>
        </div>
    );
}
