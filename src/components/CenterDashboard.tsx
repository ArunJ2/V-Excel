'use client';

import { FaUsers, FaUserCheck, FaClock, FaCalendarDays, FaLocationDot, FaPlus, FaPen } from "react-icons/fa6";
import DataCard from "./DataCard";
import Link from "next/link";
import { useState } from "react";
import EventModal from "./EventModal";

interface CenterDashboardProps {
    stats: {
        totalStudents: number;
        activeStudents: number;
        avgAttendance: number;
        disabilityDist: Array<{ type: string; count: number }>;
        upcomingEvents: Array<{
            id: number;
            title: string;
            description: string;
            date: string;
            location: string;
            type: string;
        }>;
    };
    userRole: string;
}

export default function CenterDashboard({ stats, userRole }: CenterDashboardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAddEvent = () => {
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: any) => {
        if (userRole !== 'admin') return;
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-2xl">
                        <FaUsers />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.totalStudents}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                        <FaUserCheck />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Today</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.activeStudents}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
                        <FaClock />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg Attendance</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.avgAttendance}%</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Disability Distribution */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-800">Student Distribution</h3>
                            <Link href="/student-info" className="text-sm font-bold text-brand-600 hover:text-brand-700">View Directory</Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.disabilityDist.map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-700">{item.type}</span>
                                        <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">{item.count}</span>
                                    </div>
                                    <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-brand-500 h-full rounded-full"
                                            style={{ width: `${(item.count / (stats.totalStudents || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {stats.disabilityDist.length === 0 && (
                                <p className="text-slate-400 italic col-span-2 text-center py-8">No student data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Upcoming Events</h3>
                            {userRole === 'admin' && (
                                <button
                                    onClick={handleAddEvent}
                                    className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                                >
                                    <FaPlus size={12} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {stats.upcomingEvents.map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => handleEditEvent(event)}
                                    className={`group relative pl-4 border-l-4 border-brand-500 hover:bg-slate-50 p-4 rounded-r-xl transition-all ${userRole === 'admin' ? 'cursor-pointer' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-600">{event.title}</h4>
                                            {userRole === 'admin' && <FaPen className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${event.type === 'holiday' ? 'bg-rose-50 text-rose-600' :
                                            event.type === 'workshop' ? 'bg-amber-50 text-amber-600' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {event.type}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                            <FaCalendarDays className="text-brand-500" />
                                            {formatDate(event.date)} at {formatTime(event.date)}
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                <FaLocationDot className="text-brand-500" />
                                                {event.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {stats.upcomingEvents.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <FaCalendarDays size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400">No scheduled events</p>
                                    <p className="text-xs text-slate-300">New events will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={selectedEvent}
                onSuccess={() => {
                    // Logic to refresh data if needed, but revalidatePath is used in actions
                }}
            />
        </div>
    );
}
