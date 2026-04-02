'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createStudentAction(data: any) {
    try {
        if (!data.udid) {
            return { error: 'UDID is required' };
        }

        // Validate UDID uniqueness
        const existingUdid = await prisma.student.findUnique({ where: { udid: data.udid } });
        if (existingUdid) {
            return { error: 'UDID already exists. Please enter a unique UDID.' };
        }

        // Validate IPP uniqueness
        const existingIpp = await prisma.student.findUnique({ where: { ipp_number: data.ipp_number } });
        if (existingIpp) {
            return { error: 'IPP Number already exists.' };
        }

        const dp = data.days_present ? parseInt(data.days_present as string) : 0;
        const da = data.days_absent ? parseInt(data.days_absent as string) : 0;
        const total = dp + da;
        const attendancePercent = total > 0 ? Math.round((dp / total) * 100) : 100;

        await prisma.student.create({
            data: {
                udid: data.udid,
                ipp_number: data.ipp_number,
                name: data.name,
                dob: new Date(data.dob),
                gender: data.gender,
                blood_group: data.blood_group,
                height: data.height,
                weight: data.weight,
                address: data.address,
                center_name: data.center_name,
                parent_names: data.parent_names,
                parent_contact: data.parent_contact,
                parent_email: data.parent_email,
                disability_type: data.disability_type,
                disability_detail: data.disability_detail,
                clinical_case_no: data.clinical_case_no,
                therapist_assigned: data.therapist_assigned,
                referral_doctor: data.referral_doctor,
                days_present: dp,
                days_absent: da,
                total_working_days: total,
                attendance: attendancePercent,
                quick_notes: data.quick_notes,
            }
        });
        revalidatePath('/student-info');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function deleteStudentAction(id: number) {
    try {
        await prisma.student.delete({ where: { id } });
        revalidatePath('/student-info');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function getStudentProfile(ippNumber: string) {
    try {
        return await prisma.student.findUnique({
            where: { ipp_number: ippNumber },
            include: {
                clinical_history: true,
                milestones: true,
                adl: true,
                observations: true
            }
        });
    } catch (error) {
        console.error('Error fetching student profile:', error);
        return null;
    }
}

export async function getStudentById(id: number) {
    try {
        return await prisma.student.findUnique({
            where: { id },
            include: {
                clinical_history: true,
                milestones: true,
                adl: true,
                observations: true
            }
        });
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        return null;
    }
}

export async function getStudentClinicalHistory(studentId: number) {
    try {
        return await prisma.clinicalHistory.findUnique({
            where: { student_id: studentId }
        });
    } catch (error) {
        console.error('Error fetching clinical history:', error);
        return null;
    }
}

export async function getDevelopmentalMilestones(studentId: number) {
    try {
        return await prisma.developmentalMilestones.findUnique({
            where: { student_id: studentId }
        });
    } catch (error) {
        console.error('Error fetching milestones:', error);
        return null;
    }
}

export async function getDailyLivingSkills(studentId: number) {
    try {
        return await prisma.dailyLivingSkills.findUnique({
            where: { student_id: studentId }
        });
    } catch (error) {
        console.error('Error fetching ADL:', error);
        return null;
    }
}

export async function getClinicalObservations(studentId: number) {
    try {
        return await prisma.clinicalObservations.findUnique({
            where: { student_id: studentId }
        });
    } catch (error) {
        console.error('Error fetching observations:', error);
        return null;
    }
}

export async function updateStudentProfile(studentId: number, data: any) {
    try {
        if (data.dob) data.dob = new Date(data.dob);

        // Validate UDID uniqueness if updated
        if (data.udid) {
            const existingUdid = await prisma.student.findUnique({ where: { udid: data.udid } });
            if (existingUdid && existingUdid.id !== studentId) {
                return { error: 'UDID already exists. Please enter a unique UDID.' };
            }
        }

        // Auto-calculate attendance if days are provided
        if (data.days_present !== undefined || data.days_absent !== undefined) {
            const currentStudent = await prisma.student.findUnique({
                where: { id: studentId },
                select: { days_present: true, days_absent: true }
            });

            const daysPresent = data.days_present !== undefined ? parseInt(data.days_present as string) : (currentStudent?.days_present ?? 0);
            const daysAbsent = data.days_absent !== undefined ? parseInt(data.days_absent as string) : (currentStudent?.days_absent ?? 0);
            const totalDays = daysPresent + daysAbsent;

            data.total_working_days = totalDays;
            data.days_present = daysPresent;
            data.days_absent = daysAbsent;

            if (totalDays > 0) {
                data.attendance = Math.round((daysPresent / totalDays) * 100);
            } else {
                data.attendance = 100;
            }
        } else {
            delete data.attendance;
        }

        await prisma.student.update({
            where: { id: studentId },
            data: {
                ...data,
                updated_at: new Date()
            }
        });
        revalidatePath('/dashboard');
        revalidatePath('/student-info');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function uploadProfilePictureAction(studentId: number, formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { error: 'No image file uploaded' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        const student = await prisma.student.update({
            where: { id: studentId },
            data: { profile_picture: base64Image }
        });

        revalidatePath('/dashboard');
        revalidatePath('/student-info');
        return { success: true, profile_picture: student.profile_picture };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function getAllStudents() {
    try {
        return await prisma.student.findMany({
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}
