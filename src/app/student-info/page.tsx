import { studentApi } from "@/lib/api-server";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import StudentDirectoryClient from "@/components/StudentDirectoryClient";

export default async function StudentInfoPage() {
    const students = await studentApi.getAll();

    const addBtn = (
        <Link href="/admin/add-student" className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
            Add New Student
        </Link>
    );

    return (
        <PageContainer
            title="Student Directory"
            subtitle="Browse and manage all registered student profiles"
            action={addBtn}
        >
            <StudentDirectoryClient students={students} />
        </PageContainer>
    );
}
