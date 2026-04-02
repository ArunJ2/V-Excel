'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCenterStatsAction() {
    try {
        const totalStudents = await prisma.student.count();
        const activeStudents = await prisma.student.count({ where: { active_status: true } });

        const allStudents = await prisma.student.findMany({
            select: { attendance: true }
        });

        const avgAttendance = allStudents.length > 0
            ? Math.round(allStudents.reduce((acc, s) => acc + s.attendance, 0) / allStudents.length)
            : 0;

        // Get count by disability type
        const disabilityDist = await prisma.student.groupBy({
            by: ['disability_type'],
            _count: {
                id: true
            }
        });

        // Get upcoming events (next 5)
        const upcomingEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: new Date()
                }
            },
            orderBy: {
                date: 'asc'
            },
            take: 5
        });

        return {
            totalStudents,
            activeStudents,
            avgAttendance,
            disabilityDist: disabilityDist.map(d => ({
                type: d.disability_type || 'Unspecified',
                count: d._count.id
            })),
            upcomingEvents
        };
    } catch (error) {
        console.error('Error fetching center stats:', error);
        return null;
    }
}

export async function createEventAction(data: any) {
    try {
        const event = await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                date: new Date(data.date),
                location: data.location,
                type: data.type
            }
        });
        revalidatePath('/dashboard');
        return event;
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function updateEventAction(id: number, data: any) {
    try {
        const event = await prisma.event.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                date: new Date(data.date),
                location: data.location,
                type: data.type
            }
        });
        revalidatePath('/dashboard');
        return event;
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function deleteEventAction(id: number) {
    try {
        await prisma.event.delete({
            where: { id }
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function getUpcomingEventsAction() {
    try {
        return await prisma.event.findMany({
            where: {
                date: {
                    gte: new Date()
                }
            },
            orderBy: {
                date: 'asc'
            },
            take: 10
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}
