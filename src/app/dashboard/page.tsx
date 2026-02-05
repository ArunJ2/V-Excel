import TabsContainer from "@/components/TabsContainer";
import DataCard from "@/components/DataCard";
import Accordion from "@/components/Accordion";
import ReportList from "@/components/ReportList";
import UploadReportForm from "@/components/UploadReportForm";
import ProgressChart from "@/components/ProgressChart";
import { FaUsers, FaBaby, FaNotesMedical, FaEye, FaBrain, FaComments, FaFaceSmile, FaFileLines, FaPlus, FaLink, FaIdCard } from "react-icons/fa6";
import { getStudentProfile, getStudentById, getStudentClinicalHistory, getDevelopmentalMilestones, getDailyLivingSkills, getClinicalObservations } from "@/actions/student-actions";
import { getStudentReports } from "@/actions/report-actions";
import { getCenterStatsAction } from "@/actions/dashboard-actions";
import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import { cookies } from 'next/headers';
import EditableSection from "@/components/EditableSection";
import EditSectionButton from "@/components/EditSectionButton";
import EditStudentProfileButton from "@/components/EditStudentProfileButton";
import CenterDashboard from "@/components/CenterDashboard";
import Link from "next/link";

export default async function DashboardPage({ searchParams }: { searchParams: { id?: string } }) {
    // 1. Resolve User and View Mode
    const userCookie = cookies().get('user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    const userRole = user?.role || 'parent';

    let studentIdToFetch = searchParams.id ? parseInt(searchParams.id) : null;
    let isCenterView = false;

    // If parent, force their linked student
    if (userRole === 'parent' && user.linked_student_id) {
        studentIdToFetch = user.linked_student_id;
    } else if (!studentIdToFetch && (userRole === 'admin' || userRole === 'staff')) {
        isCenterView = true;
    }

    // 2. Handle Center View
    if (isCenterView) {
        const stats = await getCenterStatsAction();
        return (
            <PageContainer
                title="Center Overview"
                subtitle="Aggregated metrics and upcoming events"
                action={
                    userRole === 'admin' && (
                        <Link
                            href="/student-info"
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                        >
                            <FaPlus className="text-sm" />
                            Add Student
                        </Link>
                    )
                }
            >
                <CenterDashboard stats={stats} userRole={userRole} />
            </PageContainer>
        );
    }

    // 3. Fetch Single Student Data
    let studentData = studentIdToFetch ? await getStudentById(studentIdToFetch) : null;

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
            {/* Attendance Card - Full Width */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Attendance</h3>
                        <p className="text-xs text-slate-500">Current academic year</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${(studentData.attendance ?? 100) >= 75 ? 'text-green-600 bg-green-50 border-green-100' :
                            (studentData.attendance ?? 100) >= 50 ? 'text-amber-600 bg-amber-50 border-amber-100' :
                                'text-red-600 bg-red-50 border-red-100'
                            }`}>
                            {(studentData.attendance ?? 100) >= 75 ? 'Excellent' : (studentData.attendance ?? 100) >= 50 ? 'Average' : 'Low'}
                        </span>
                        <EditStudentProfileButton
                            studentId={studentData.id}
                            section="attendance"
                            currentData={studentData}
                            userRole={userRole}
                        />
                    </div>
                </div>
                <div className="flex items-end gap-4">
                    <span className="text-5xl font-bold text-slate-800">{studentData.attendance ?? 100}%</span>
                    <span className="text-sm text-slate-500 mb-2">Yearly Average</span>
                </div>
                <div className="w-full bg-slate-100 h-3 mt-4 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all ${(studentData.attendance ?? 100) >= 75 ? 'bg-green-500' :
                            (studentData.attendance ?? 100) >= 50 ? 'bg-amber-500' :
                                'bg-red-500'
                            }`}
                        style={{ width: `${studentData.attendance ?? 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Student Profile Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DataCard title="Personal Information" action={
                    <EditStudentProfileButton
                        studentId={studentData.id}
                        section="personal_info"
                        currentData={studentData}
                        userRole={userRole}
                    />
                }>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Full Name</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">IPP Number</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.ipp_number}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Date of Birth</span>
                            <span className="text-sm font-semibold text-slate-700">{formattedDOB}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Blood Group</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.blood_group || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Gender</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.gender || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Height</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.height ? `${studentData.height} cm` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Weight</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.weight ? `${studentData.weight} kg` : 'N/A'}</span>
                        </div>
                    </div>
                </DataCard>

                <DataCard title="Guardian Details" action={
                    <EditStudentProfileButton
                        studentId={studentData.id}
                        section="guardian_details"
                        currentData={studentData}
                        userRole={userRole}
                    />
                }>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Parents</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.parent_names || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Contact</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.parent_contact || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Email</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.parent_email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Address</span>
                            <span className="text-sm font-semibold text-slate-700 text-right max-w-[150px] truncate">{studentData.address || 'N/A'}</span>
                        </div>
                    </div>
                </DataCard>

                <DataCard title="Clinical Information" action={
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${studentData.active_status ? 'text-green-600 bg-green-50 border-green-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                            {studentData.active_status ? 'Active' : 'Inactive'}
                        </span>
                        <EditStudentProfileButton
                            studentId={studentData.id}
                            section="clinical_info"
                            currentData={studentData}
                            userRole={userRole}
                        />
                    </div>
                }>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Disability Type</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.disability_type || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Referral Doctor</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.referral_doctor || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Therapist</span>
                            <span className="text-sm font-semibold text-slate-700">{studentData.therapist_assigned || 'N/A'}</span>
                        </div>
                    </div>
                </DataCard>
            </div >

            {/* Progress Chart & Quick Notes */}
            < div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Learning Progress</h3>
                            <p className="text-xs text-slate-500">Monthly developmental tracking</p>
                        </div>
                    </div>
                    <ProgressChart title="Learning Progress" data={[40, 45, 42, 55, 60, 68]} />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                        <h3 className="text-sm font-bold text-slate-800">Quick Notes</h3>
                        <EditStudentProfileButton
                            studentId={studentData.id}
                            section="quick_notes"
                            currentData={studentData}
                            userRole={userRole}
                        />
                    </div>
                    <div className="space-y-3">
                        {studentData.quick_notes || studentData.disability_detail ? (
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {studentData.quick_notes || studentData.disability_detail}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No notes available. Click edit to add notes.</p>
                        )}
                    </div>
                </div>
            </div >
        </div >
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

    return (
        <PageContainer
            title={
                <span className="flex items-center gap-3">
                    {studentData.name}
                    <span className="text-sm font-normal text-slate-400 flex items-center gap-1">
                        <FaIdCard className="text-brand-500" />
                        {studentData.udid || 'Generating...'}
                    </span>
                </span>
            }
            subtitle={`${studentData.center_name || 'V-Excel Foundation'}`}
            action={
                <div className="flex items-center gap-2">
                    {(userRole === 'admin' || userRole === 'staff') && studentData.public_link_token && (
                        <a
                            href={`/emergency/${studentData.public_link_token}`}
                            target="_blank"
                            className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 transition-colors border border-rose-100"
                            title="Public Emergency Link"
                        >
                            <FaLink className="text-sm" />
                            Emergency
                        </a>
                    )}
                    <a
                        href={`/reports/generate?id=${studentData.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                    >
                        <FaFileLines className="text-sm" />
                        Generate Report
                    </a>
                </div>
            }
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
        </PageContainer >
    );
}
