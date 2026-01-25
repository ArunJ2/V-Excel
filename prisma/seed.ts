import { PrismaClient, Role, MilestoneStatus, ADLStatus, ReportType, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Create Student: Rahul S.
    const student = await prisma.student.create({
        data: {
            ipp_number: 'IPP-3211',
            name: 'Rahul S.',
            dob: new Date('2013-08-12'),
            blood_group: 'O+',
            gender: 'Male',
            address: 'R.A. Puram, Chennai',
            parent_names: 'Mr. & Mrs. Sharma',
            parent_contact: '+91 98765 43210',
            disability_type: 'Autism Spectrum',
            referral_doctor: 'Dr. R. Kumar',
            active_status: true,

            clinical_history: {
                create: {
                    siblings_details: 'One younger sister (typcial)',
                    family_structure: 'Nuclear',
                    home_language: 'Tamil & English',
                    consanguinity: false,
                    pregnancy_duration: 'Full term',
                    delivery_nature: 'C-Section',
                    birth_weight: '2.8 kg',
                    birth_cry: 'Delayed by 2 mins',
                    history_seizures: true,
                    history_respiratory: false,
                    current_medications: 'Anti-epileptics (Sodium Valproate)',
                    allergies: 'None',
                    age_disability_noticed: '18 months (Language delay)',
                },
            },

            developmental_milestones: {
                create: {
                    social_smile: MilestoneStatus.Normal,
                    neck_control: MilestoneStatus.Normal,
                    sitting: MilestoneStatus.Delayed,
                    crawling: MilestoneStatus.Delayed,
                    standing: MilestoneStatus.Delayed,
                    walking: MilestoneStatus.Delayed,
                    speech_initiation: MilestoneStatus.Delayed,
                },
            },

            daily_living_skills: {
                create: {
                    eating: ADLStatus.Independent,
                    dressing: ADLStatus.Dependent,
                    toileting: ADLStatus.In_Progress,
                },
            },

            clinical_observations: {
                create: {
                    general_appearance: 'Well groomed, makes fleeting eye contact',
                    psychomotor_skills: 'Fine motor delays, grip strength weak',
                    sensory_issues: 'Auditory sensitivity to loud noises',
                    cognition_memory: 'Good rote memory, struggles with abstract concepts',
                    communication_expressive: 'Uses single words/short phrases',
                    communication_receptive: 'Follows 1-step commands',
                    social_interaction: 'Parallel play, limited peer interaction',
                },
            },
        },
    });

    console.log(`Created student with id: ${student.id}`);

    // 2. Create Users
    // Staff
    const staffUser = await prisma.user.create({
        data: {
            email: 'staff@vexcel.org',
            role: Role.staff,
        },
    });
    console.log(`Created staff user: ${staffUser.email}`);

    // Parent (Linked to Rahul)
    const parentUser = await prisma.user.create({
        data: {
            email: 'parent@gmail.com',
            role: Role.parent,
            linked_student_id: student.id,
        },
    });
    console.log(`Created parent user: ${parentUser.email}`);

    // 3. Create Reports
    await prisma.report.createMany({
        data: [
            {
                student_id: student.id,
                type: ReportType.Screening,
                summary_text: 'Initial screening showing signs of ASD.',
                created_by: staffUser.id,
                status: ReportStatus.Approved,
                created_at: new Date('2024-01-15'),
            },
            {
                student_id: student.id,
                type: ReportType.Quarterly,
                summary_text: 'Q1 Progress Report: Improvements in sitting tolerance.',
                created_by: staffUser.id,
                status: ReportStatus.Approved,
                created_at: new Date('2024-04-10'),
            },
        ],
    });
    console.log('Created reports');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
