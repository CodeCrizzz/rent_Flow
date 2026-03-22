"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalRooms: 0, activeTenants: 0, pendingDues: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) return <div className="font-medium text-slate-400 text-sm animate-pulse">Loading workspace...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Area */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                <p className="text-slate-500 text-sm mt-1">Real-time metrics for your property.</p>
            </div>

            {/* Ultra-Clean Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1: Rooms */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Total</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-1">Registered Rooms</h3>
                        <p className="text-4xl font-bold text-slate-900 tracking-tight">{stats.totalRooms}</p>
                    </div>
                </div>

                {/* Card 2: Tenants */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Active</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-1">Current Tenants</h3>
                        <p className="text-4xl font-bold text-slate-900 tracking-tight">{stats.activeTenants}</p>
                    </div>
                </div>

                {/* Card 3: Payments */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Pending</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-1">Outstanding Dues</h3>
                        <p className="text-4xl font-bold text-slate-900 tracking-tight">₱ {Number(stats.pendingDues).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Empty State / Getting Started (Clean Slate) */}
            {stats.totalRooms === 0 && (
                <div className="mt-8 bg-white border border-slate-200/80 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-1">No rooms configured yet</h2>
                        <p className="text-sm text-slate-500 max-w-md">Your database is currently empty. Start by adding your first accommodation to the system to begin assigning tenants and tracking payments.</p>
                    </div>
                    <Link href="/admin/rooms" className="shrink-0 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
                        Configure Rooms
                    </Link>
                </div>
            )}
        </div>
    );
}