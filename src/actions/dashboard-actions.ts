'use server';

import { apiFetchServer } from "@/lib/api-server";
import { revalidatePath } from "next/cache";

export async function getCenterStatsAction() {
    try {
        return await apiFetchServer('/dashboard/stats');
    } catch (error) {
        console.error('Error fetching center stats:', error);
        return null;
    }
}

export async function createEventAction(data: any) {
    try {
        const res = await apiFetchServer('/dashboard/events', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        revalidatePath('/dashboard');
        return res;
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function updateEventAction(id: number, data: any) {
    try {
        const res = await apiFetchServer(`/dashboard/events/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        revalidatePath('/dashboard');
        return res;
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function deleteEventAction(id: number) {
    try {
        const res = await apiFetchServer(`/dashboard/events/${id}`, {
            method: 'DELETE'
        });
        revalidatePath('/dashboard');
        return res;
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function getUpcomingEventsAction() {
    try {
        return await apiFetchServer('/dashboard/events');
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}
