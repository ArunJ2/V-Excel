import { getStudentById, getStudentClinicalHistory, getDevelopmentalMilestones, getDailyLivingSkills, getClinicalObservations } from "@/actions/student-actions";
import { getStudentReports } from "@/actions/report-actions";
import { notFound } from "next/navigation";
import StudentReportView from "@/components/StudentReportView";
import { cookies } from 'next/headers';

export default async function GenerateReportPage({ searchParams }: { searchParams: { id?: string } }) {
    // Get user info
    const userCookie = cookies().get('user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;

    let studentId = searchParams.id ? parseInt(searchParams.id) : null;

    // If parent, use their linked student
    if (user?.role === 'parent' && user.linked_student_id) {
        studentId = user.linked_student_id;
    }

    if (!studentId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">No Student Selected</h1>
                    <p className="text-slate-600 mb-6">Please select a student to generate a report.</p>
                    <a href="/student-info" className="inline-block px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors">
                        Go to Student Directory
                    </a>
                </div>
            </div>
        );
    }

    // Fetch all student data
    const [studentData, clinicalHistory, milestones, adl, observations, reports] = await Promise.all([
        getStudentById(studentId),
        getStudentClinicalHistory(studentId),
        getDevelopmentalMilestones(studentId),
        getDailyLivingSkills(studentId),
        getClinicalObservations(studentId),
        getStudentReports(studentId)
    ]);

    if (!studentData) {
        notFound();
    }

    return (
        <StudentReportView
            studentData={studentData}
            clinicalHistory={clinicalHistory}
            milestones={milestones}
            adl={adl}
            observations={observations}
            reports={reports || []}
        />
    );
}
