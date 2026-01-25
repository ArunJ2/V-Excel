import StudentHeader from "@/components/StudentHeader";
import TabsContainer from "@/components/TabsContainer";
import DataCard from "@/components/DataCard";
import Accordion from "@/components/Accordion";
import ReportList from "@/components/ReportList";
import UploadReportForm from "@/components/UploadReportForm";
import ProgressChart from "@/components/ProgressChart";
import { FaUsers, FaBaby, FaNotesMedical, FaEye, FaBrain, FaComments, FaFaceSmile, FaCircleCheck, FaCalendar, FaArrowUp } from "react-icons/fa6";
import { getStudentProfile, getStudentById, getStudentClinicalHistory, getDevelopmentalMilestones, getDailyLivingSkills, getClinicalObservations } from "@/actions/student-actions";
import { getStudentReports } from "@/actions/report-actions";
import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import { cookies } from 'next/headers';
import DashboardButtons from "@/components/DashboardButtons";
import EditableSection from "@/components/EditableSection";
import EditSectionButton from "@/components/EditSectionButton";

export default async function DashboardPage({ searchParams }: { searchParams: { id?: string } }) {
    // 1. Resolve Student ID based on Role
    const userCookie = cookies().get('user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;

    let studentIdToFetch = searchParams.id ? parseInt(searchParams.id) : null;

    // If parent, force their linked student
    if (user?.role === 'parent' && user.linked_student_id) {
        studentIdToFetch = user.linked_student_id;
    }

    // 2. Fetch Student Data
    let studentData;

    if (studentIdToFetch) {
        studentData = await getStudentById(studentIdToFetch);
    } else {
        // Default for staff/admin if no ID provided
        studentData = await getStudentProfile('IPP-3211');
    }

    if (!studentData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">No Student Selected</h2>
                    <p className="text-slate-600 mb-6">
                        Please select a student from the Student Directory to view their profile.
                    </p>
                    <a
                        href="/student-info"
                        className="inline-block px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors"
                    >
                        Go to Student Directory
                    </a>
                </div>
            </div>
        );
    }

    // Format DOB
    const dob = new Date(studentData.dob);
    const formattedDOB = !isNaN(dob.getTime())
        ? dob.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        : "N/A";

    const studentMap = {
        name: studentData.name,
        dob: formattedDOB,
        blood_group: studentData.blood_group || "N/A",
        address: studentData.address || "N/A",
        parent_names: studentData.parent_names,
        parent_contact: studentData.parent_contact,
        disability_type: studentData.disability_type || "N/A",
        referral_doctor: studentData.referral_doctor || "N/A",
        active_status: studentData.active_status
    };

    // 1. Overview Content
    const OverviewContent = (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DataCard title="Attendance" action={<span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-100">Excellent</span>}>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-slate-800">92%</span>
                        <span className="text-sm text-slate-500 mb-1">Yearly</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[92%]"></div>
                    </div>
                </DataCard>

                <DataCard title="Next Screening" action={<div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600"><FaCalendar /></div>}>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-slate-800">14 Nov</span>
                        <span className="text-sm text-slate-500 mb-1">2025</span>
                    </div>
                    <p className="text-xs text-brand-600 font-medium mt-3 bg-brand-50 inline-block px-2 py-1 rounded">25 Days remaining</p>
                </DataCard>

                <DataCard title="Active Services">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <span className="text-sm font-semibold text-slate-700 block">Occupational Therapy</span>
                                <span className="text-[10px] text-slate-500">Since Jan 2024 (2 Sessions/wk)</span>
                            </div>
                            <FaCircleCheck className="text-green-500" />
                        </div>
                        <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <span className="text-sm font-semibold text-slate-700 block">Speech Therapy</span>
                                <span className="text-[10px] text-slate-500">Since Mar 2024 (1 Session/wk)</span>
                            </div>
                            <FaCircleCheck className="text-green-500" />
                        </div>
                    </div>
                </DataCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Learning Progress</h3>
                            <p className="text-xs text-slate-500">Monthly developmental tracking</p>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">
                            <FaArrowUp className="text-[10px]" /> 12%
                        </div>
                    </div>
                    <ProgressChart title="Learning Progress" data={[40, 45, 42, 55, 60, 68]} />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Parental Areas of Concern</h3>
                    <p className="text-sm text-slate-600 leading-relaxed italic flex-grow">
                        "Difficulty in communicating needs verbally. Shows restlessness during evening hours. Social interaction with peers is limited."
                    </p>
                    <button className="mt-4 w-full py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                        Add Note
                    </button>
                </div>
            </div>
        </div>
    );

    // 2. Fetch All Data in Parallel
    const [historyData, milestonesData, adlData, observationsData, reportsData] = await Promise.all([
        getStudentClinicalHistory(studentData.id),
        getDevelopmentalMilestones(studentData.id),
        getDailyLivingSkills(studentData.id),
        getClinicalObservations(studentData.id),
        getStudentReports(studentData.id)
    ]);

    // Check if user can edit (admin or staff)
    const canEdit = user?.role === 'admin' || user?.role === 'staff';

    // 2. History Content
    const HistoryContent = (
        <div className="space-y-6">
            <EditableSection
                studentId={studentData.id}
                section="clinical_history"
                currentData={historyData}
                title={<><FaUsers className="text-slate-400" /> Family & Medical History</>}
                canEdit={canEdit}
            >
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Siblings</label><p className="mt-1 font-medium text-slate-800">{historyData?.siblings_details || "N/A"}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Family Type</label><p className="mt-1 font-medium text-slate-800">{historyData?.family_structure || "N/A"}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Base</label><p className="mt-1 font-medium text-slate-800">{studentData.address?.split(',').pop()?.trim() || "N/A"}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Home Language</label><p className="mt-1 font-medium text-slate-800">{historyData?.home_language || "N/A"}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Consanguinity</label><p className="mt-1 font-medium text-slate-800">{historyData?.consanguinity ? "Yes" : "No"}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Pregnancy</label><p className="mt-1 font-medium text-slate-800">{historyData?.pregnancy_duration || "N/A"}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Delivery</label><p className="mt-1 font-medium text-slate-800">{historyData?.delivery_nature || "N/A"}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Birth Weight</label><p className="mt-1 font-medium text-slate-800">{historyData?.birth_weight || "N/A"}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Birth Cry</label><p className="mt-1 font-medium text-slate-800">{historyData?.birth_cry || "N/A"}</p></div>
                </div>
            </EditableSection>
        </div>
    );

    // 3. Development Content
    const DevelopmentContent = (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EditableSection
                studentId={studentData.id}
                section="milestones"
                currentData={milestonesData}
                title={<>Developmental Milestones</>}
                canEdit={canEdit}
            >
                <div className="p-0">
                    <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { label: "Social Smile", status: milestonesData?.social_smile || "N/A", color: milestonesData?.social_smile === 'Normal' ? 'green' : 'amber' },
                                { label: "Neck Control", status: milestonesData?.neck_control || "N/A", color: milestonesData?.neck_control === 'Normal' ? 'green' : 'amber' },
                                { label: "Crawling", status: milestonesData?.crawling || "N/A", color: milestonesData?.crawling === 'Normal' ? 'green' : 'amber' },
                                { label: "Walking", status: milestonesData?.walking || "N/A", color: milestonesData?.walking === 'Normal' ? 'green' : 'amber' },
                                { label: "Speech", status: milestonesData?.speech_initiation || "N/A", color: milestonesData?.speech_initiation === 'Normal' ? 'green' : 'amber' }
                            ].map((item, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-3 font-medium text-slate-600">{item.label}</td>
                                    <td className="px-6 py-3 text-right">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </EditableSection>

            <EditableSection
                studentId={studentData.id}
                section="adl"
                currentData={adlData}
                title={<>Activities of Daily Living (ADL)</>}
                canEdit={canEdit}
            >
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">Eating</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${adlData?.eating === 'Independent' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>{adlData?.eating || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">Dressing</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${adlData?.dressing === 'Independent' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>{adlData?.dressing || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">Toileting</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${adlData?.toileting === 'Independent' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>{adlData?.toileting || "N/A"}</span>
                    </div>
                </div>
            </EditableSection>
        </div>
    );

    // 4. Clinical Content
    const ClinicalContent = (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">Clinical Observations</h3>
                {canEdit && (
                    <EditSectionButton
                        studentId={studentData.id}
                        section="observations"
                        currentData={observationsData}
                    />
                )}
            </div>
            <Accordion title={<><FaEye className="w-6 text-slate-400" /> General Appearance & Psychomotor</>} defaultOpen>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="text-xs font-bold text-slate-400 uppercase">General Appearance</label><p className="mt-1 text-sm text-slate-800">{observationsData?.general_appearance || "N/A"}</p></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Psychomotor Skills</label><p className="mt-1 text-sm text-slate-800">{observationsData?.psychomotor_skills || "N/A"}</p></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400 uppercase">Sensory Issues</label><p className="mt-1 text-sm text-slate-800">{observationsData?.sensory_issues || "N/A"}</p></div>
                </div>
            </Accordion>
            <Accordion title={<><FaBrain className="w-6 text-slate-400" /> Cognition & Memory</>}>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="text-xs font-bold text-slate-400 uppercase">Cognition & Memory</label><p className="mt-1 text-sm text-slate-800">{observationsData?.cognition_memory || "N/A"}</p></div>
                </div>
            </Accordion>
            <Accordion title={<><FaComments className="w-6 text-slate-400" /> Communication</>}>
                <div className="p-6 text-sm text-slate-600 space-y-2">
                    <p><strong>Expressive:</strong> {observationsData?.communication_expressive || "N/A"}</p>
                    <p><strong>Receptive:</strong> {observationsData?.communication_receptive || "N/A"}</p>
                </div>
            </Accordion>
            <Accordion title={<><FaFaceSmile className="w-6 text-slate-400" /> Social & Emotional</>}>
                <div className="p-6 text-sm text-slate-600">{observationsData?.social_interaction || "N/A"}</div>
            </Accordion>
        </div>
    );

    // 5. Reports Content
    const formattedReports = (reportsData || []).map((r: any) => {
        const reportDate = new Date(r.created_at);
        return {
            id: r.id,
            title: r.type + " Report",
            date: !isNaN(reportDate.getTime())
                ? reportDate.toLocaleDateString("en-GB", { month: 'short', year: 'numeric' })
                : "N/A",
            type: String(r.type),
            result: r.summary_text || undefined
        };
    });

    const ReportsContent = (
        <div className="space-y-6">
            <div id="upload-section">
                <UploadReportForm studentId={studentData.id} />
            </div>
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-6">
                <h3 className="text-sm font-bold text-brand-800 mb-2">Summary & Recommendation</h3>
                <p className="text-sm text-brand-700 mb-4">Student requires continued Speech Therapy and OT.</p>
                <h3 className="text-sm font-bold text-brand-800 mb-2">Course of Action</h3>
                <ul className="list-disc list-inside text-sm text-brand-700">
                    <li>Increase Speech Therapy to 2/week.</li>
                    <li>Sensory diet to be followed at home.</li>
                </ul>
            </div>
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Test Reports & Files</h3>
                <ReportList reports={formattedReports} />
            </div>
        </div>
    );

    const actionBtns = (
        <DashboardButtons studentId={studentData.id} />
    );

    return (
        <PageContainer
            title={studentData.name}
            subtitle={`IPP Number: ${studentData.ipp_number}`}
            action={actionBtns}
        >
            <div className="grid grid-cols-12 gap-6 pb-20">
                <div className="col-span-12">
                    <TabsContainer
                        overviewContent={OverviewContent}
                        historyContent={HistoryContent}
                        developmentContent={DevelopmentContent}
                        clinicalContent={ClinicalContent}
                        reportsContent={ReportsContent}
                    />
                </div>
            </div>
        </PageContainer>
    );
}
