'use client';

import { useState, useEffect } from "react";
import { FaXmark, FaCalendarDays, FaLocationDot, FaAlignLeft, FaTag, FaTrash } from "react-icons/fa6";
import { createEventAction, updateEventAction, deleteEventAction } from "@/actions/dashboard-actions";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event?: any; // If present, we're editing
    onSuccess: () => void;
}

export default function EventModal({ isOpen, onClose, event, onSuccess }: EventModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        type: "meeting"
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (event) {
            // Format date for datetime-local input
            const dateObj = new Date(event.date);
            const formattedDate = dateObj.toISOString().slice(0, 16);
            setFormData({
                title: event.title || "",
                description: event.description || "",
                date: formattedDate,
                location: event.location || "",
                type: event.type || "meeting"
            });
        } else {
            setFormData({
                title: "",
                description: "",
                date: "",
                location: "",
                type: "meeting"
            });
        }
    }, [event, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (event) {
                await updateEventAction(event.id, formData);
            } else {
                await createEventAction(formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving event:", error);
            alert("Failed to save event");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!event || !confirm("Are you sure you want to delete this event?")) return;
        setIsDeleting(true);
        try {
            await deleteEventAction(event.id);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">
                        {event ? "Edit Event" : "Add New Event"}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                        <FaXmark size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FaTag className="text-brand-500" /> Event Title
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
                            placeholder="e.g., Parent Teacher Meeting"
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FaCalendarDays className="text-brand-500" /> Date & Time
                        </label>
                        <input
                            required
                            type="datetime-local"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FaLocationDot className="text-brand-500" /> Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
                            placeholder="e.g., Main Hall / Online"
                        />
                    </div>

                    {/* Event Type */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FaTag className="text-brand-500" /> Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
                        >
                            <option value="meeting">Meeting</option>
                            <option value="workshop">Workshop</option>
                            <option value="holiday">Holiday</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FaAlignLeft className="text-brand-500" /> Description
                        </label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-medium text-slate-800 resize-none"
                            placeholder="Provide some details about the event..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        {event && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-3 rounded-xl border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-colors flex items-center gap-2"
                            >
                                <FaTrash />
                                {isDeleting ? "Deleting..." : ""}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : event ? "Update Event" : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
