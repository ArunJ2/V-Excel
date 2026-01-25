import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const ippNumber = 'IPP-3211';
    console.log(`Reading student data for ${ippNumber}...`);

    const student = await prisma.student.findUnique({
        where: { ipp_number: ippNumber },
    });

    if (!student) {
        console.error('Student not found!');
        return;
    }

    console.log(`Current Name: ${student.name}`);

    const newName = student.name.includes('(Verified)')
        ? 'Rahul S.'
        : 'Rahul S. (Verified)';

    console.log(`Updating name to: ${newName}...`);

    const updatedStudent = await prisma.student.update({
        where: { ipp_number: ippNumber },
        data: { name: newName },
    });

    // Fetch a valid staff user for author_id
    const staffUser = await prisma.user.findFirst({
        where: { role: 'staff' as any } // Cast for safety if enum missing
    });

    if (!staffUser) {
        console.error('No staff user found! Cannot create report.');
        return;
    }

    console.log(`Success! New Name in DB: ${updatedStudent.name}`);

    // Verify Write: Create a Report
    console.log('Verifying Write: Creating a test report...');
    const report = await prisma.report.create({
        data: {
            // title: 'Auto-Generated Report', // Not in schema
            type: 'Screening' as any,
            // schema has created_at @default(now()), but I can pass it?
            // "date" field ?? Schema says created_at.
            // Let me check schema again for "date"

            // Checking schema view:
            // created_at DateTime @default(now())
            // NO "date" field.

            student_id: updatedStudent.id,
            created_by: staffUser.id, // Schema says created_by, not author_id !!
            status: 'Draft' as any,
            file_url: '/uploads/auto_test.pdf', // field is file_url
            summary_text: 'Created via verification script',
        },
    });
    console.log(`Success! Created Report ID: ${report.id}`);
    console.log('Please refresh your dashboard to see the change.');
}

main()
    .catch(async (e) => {
        console.error("Error Message:", e.message);
        console.error("Full Error:", e);
        const fs = require('fs');
        fs.writeFileSync('error.log', e.toString() + "\n" + e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
