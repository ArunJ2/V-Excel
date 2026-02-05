import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';

async function seed() {
    try {
        console.log('Seeding database...');

        // 1. Create Admin User
        const adminEmail = 'admin@vexcel.com';
        const adminPassword = 'admin123';

        let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (!adminUser) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(adminPassword, salt);
            adminUser = await prisma.user.create({
                data: {
                    email: adminEmail,
                    password_hash: hash,
                    name: 'System Admin',
                    role: 'admin',
                }
            });
            console.log('✓ Admin user created');
        } else {
            console.log('- Admin user already exists');
        }

        // 2. Create Staff User
        const staffEmail = 'staff@vexcel.com';
        const staffPassword = 'staff123';

        let staffUser = await prisma.user.findUnique({ where: { email: staffEmail } });
        if (!staffUser) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(staffPassword, salt);
            staffUser = await prisma.user.create({
                data: {
                    email: staffEmail,
                    password_hash: hash,
                    name: 'Staff Member',
                    role: 'staff',
                }
            });
            console.log('✓ Staff user created');
        } else {
            console.log('- Staff user already exists');
        }

        // 3. Create default student first (needed for parent link)
        let student = await prisma.student.findUnique({ where: { ipp_number: 'IPP-3211' } });
        if (!student) {
            student = await prisma.student.create({
                data: {
                    ipp_number: 'IPP-3211',
                    name: 'Rahul S.',
                    dob: new Date('2015-05-20'),
                    gender: 'Male',
                    blood_group: 'B+',
                    height: '120',
                    weight: '28',
                    address: '123, Mandaveli, Chennai',
                    center_name: 'V-Excel Foundation',
                    parent_names: 'Mrs. & Mr. Srinivasan',
                    parent_contact: '+91 98XXX XXXXX',
                    parent_email: 'srinivasan@example.com',
                    disability_type: 'Autism Spectrum Disorder',
                    referral_doctor: 'Dr. Venkatesh (Child Psychologist)',
                    // Attendance tracking
                    days_present: 85,
                    days_absent: 7,
                    total_working_days: 92,
                    attendance: 92, // 85/92 = 92%
                    active_status: true,
                }
            });
            console.log('✓ Default student created');
        } else {
            console.log('- Default student already exists');
        }


        // 4. Create Parent User (linked to student)
        const parentEmail = 'parent@vexcel.com';
        const parentPassword = 'parent123';

        let parentUser = await prisma.user.findUnique({ where: { email: parentEmail } });
        if (!parentUser) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(parentPassword, salt);
            parentUser = await prisma.user.create({
                data: {
                    email: parentEmail,
                    password_hash: hash,
                    name: 'Rahul\'s Parent',
                    role: 'parent',
                    linked_student_id: student.id,
                }
            });
            console.log('✓ Parent user created');
        } else {
            console.log('- Parent user already exists');
        }

        // 5. Create Clinical History for student
        const existingHistory = await prisma.clinicalHistory.findUnique({ where: { student_id: student.id } });
        if (!existingHistory) {
            await prisma.clinicalHistory.create({
                data: {
                    student_id: student.id,
                    siblings_details: '1 younger sister (8 yrs)',
                    family_structure: 'Nuclear Family',
                    home_language: 'Tamil & English',
                    consanguinity: false,
                    pregnancy_duration: 'Full Term',
                    delivery_nature: 'Normal',
                    birth_weight: '2.8 kg',
                    birth_cry: 'Immediate',
                    history_seizures: false,
                    history_respiratory: false,
                    current_medications: 'None',
                    allergies: 'None known',
                    age_disability_noticed: '2 years'
                }
            });
            console.log('✓ Clinical history created');
        }

        // 6. Create Developmental Milestones
        const existingMilestones = await prisma.developmentalMilestones.findUnique({ where: { student_id: student.id } });
        if (!existingMilestones) {
            await prisma.developmentalMilestones.create({
                data: {
                    student_id: student.id,
                    social_smile: 'Normal',
                    neck_control: 'Normal',
                    sitting: 'Normal',
                    crawling: 'Delayed',
                    standing: 'Normal',
                    walking: 'Delayed',
                    speech_initiation: 'Delayed'
                }
            });
            console.log('✓ Developmental milestones created');
        }

        // 7. Create Daily Living Skills
        const existingADL = await prisma.dailyLivingSkills.findUnique({ where: { student_id: student.id } });
        if (!existingADL) {
            await prisma.dailyLivingSkills.create({
                data: {
                    student_id: student.id,
                    eating: 'Independent',
                    dressing: 'Needs Assistance',
                    toileting: 'Partially Independent'
                }
            });
            console.log('✓ Daily living skills created');
        }

        // 8. Create Clinical Observations
        const existingObs = await prisma.clinicalObservations.findUnique({ where: { student_id: student.id } });
        if (!existingObs) {
            await prisma.clinicalObservations.create({
                data: {
                    student_id: student.id,
                    general_appearance: 'Well-groomed, age-appropriate appearance',
                    psychomotor_skills: 'Mild delay in fine motor coordination',
                    sensory_issues: 'Hypersensitive to loud sounds',
                    cognition_memory: 'Average short-term memory, good visual memory',
                    communication_expressive: 'Uses 2-3 word phrases, limited vocabulary',
                    communication_receptive: 'Follows simple instructions well',
                    social_interaction: 'Limited eye contact, parallel play preferred'
                }
            });
            console.log('✓ Clinical observations created');
        }

        // 9. Create Sample Events
        const existingEvents = await prisma.event.count();
        if (existingEvents === 0) {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);

            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            await prisma.event.createMany({
                data: [
                    {
                        title: 'Parent-Teacher Meeting',
                        description: 'Monthly progress review with parents',
                        date: nextWeek,
                        location: 'Main Hall',
                        type: 'meeting'
                    },
                    {
                        title: 'Sensory Integration Workshop',
                        description: 'Training for staff and parents',
                        date: new Date(nextWeek.getTime() + 86400000 * 2), // 2 days after PTM
                        location: 'Occupational Therapy Wing',
                        type: 'workshop'
                    },
                    {
                        title: 'Annual Day Celebrations',
                        description: 'Student cultural performances',
                        date: nextMonth,
                        location: 'V-Excel Main Campus',
                        type: 'meeting'
                    }
                ]
            });
            console.log('✓ Sample events created');
        }


        console.log('\n--------------------------------------------------');
        console.log('🎉 Seeding Complete!');
        console.log('--------------------------------------------------');
        console.log('\n📋 User Credentials:\n');
        console.log('  ADMIN:');
        console.log(`    Email: ${adminEmail}`);
        console.log(`    Password: ${adminPassword}`);
        console.log('\n  STAFF:');
        console.log(`    Email: ${staffEmail}`);
        console.log(`    Password: ${staffPassword}`);
        console.log('\n  PARENT:');
        console.log(`    Email: ${parentEmail}`);
        console.log(`    Password: ${parentPassword}`);
        console.log(`    Linked Student: ${student.name} (${student.ipp_number})`);
        console.log('\n--------------------------------------------------');

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
