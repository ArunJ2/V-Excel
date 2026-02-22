'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaSearch } from 'react-icons/fa6';

interface Student {
    id: number;
    name: string;
    ipp_number: string;
    disability_type?: string;
    active_status: boolean;
}

export default function StudentDirectoryClient({ students }: { students: Student[] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [disabilityFilter, setDisabilityFilter] = useState('all');

    // Get unique disability types for filter dropdown
    const disabilityTypes = useMemo(() => {
        const types = new Set(students.map(s => s.disability_type).filter(Boolean));
        return Array.from(types).sort();
    }, [students]);

    const filtered = useMemo(() => {
        return students.filter(student => {
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                student.name.toLowerCase().includes(q) ||
                student.ipp_number.toLowerCase().includes(q) ||
                (student.disability_type || '').toLowerCase().includes(q);

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && student.active_status) ||
                (statusFilter === 'inactive' && !student.active_status);

            const matchesDisability =
                disabilityFilter === 'all' ||
                student.disability_type === disabilityFilter;

            return matchesSearch && matchesStatus && matchesDisability;
        });
    }, [students, search, statusFilter, disabilityFilter]);

    return (
        <div>
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search by name, IPP, or disability..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                {disabilityTypes.length > 0 && (
                    <select
                        value={disabilityFilter}
                        onChange={(e) => setDisabilityFilter(e.target.value)}
                        className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="all">All Disabilities</option>
                        {disabilityTypes.map(type => (
                            <option key={type} value={type!}>{type}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Results count */}
            <p className="text-xs text-slate-400 mb-4 font-medium">
                Showing {filtered.length} of {students.length} students
            </p>

            {/* Student Cards */}
            {filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <p className="text-sm font-medium">No students match your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((student) => (
                        <div key={student.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                                    {student.name ? student.name.substring(0, 1) : 'S'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{student.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-tight">{student.ipp_number}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span className="text-slate-400">Disability</span>
                                    <span className="text-slate-600 font-semibold">{student.disability_type || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span className="text-slate-400">Status</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${student.active_status ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {student.active_status ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href={`/dashboard?id=${student.id}`}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm"
                            >
                                View Profile <FaArrowRight className="text-xs" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
