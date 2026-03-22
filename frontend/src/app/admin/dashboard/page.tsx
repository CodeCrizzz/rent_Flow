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

    if (isLoading) return <div className="font-bold text-slate-400 text-sm animate-pulse">Loading workspace...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Area */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-slate-500 font-medium mt-1">Real-time metrics for your property.</p>
            </div>

            {/* Vibrant Modern Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Rooms (Blue/Cyan) */}
                <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">Total</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">Registered Rooms</h3>
                        <p className="text-5xl font-black text-slate-900 tracking-tight">{stats.totalRooms}</p>
                    </div>
                </div>

                {/* Card 2: Tenants (Violet/Fuchsia) */}
                <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">Active</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">Current Tenants</h3>
                        <p className="text-5xl font-black text-slate-900 tracking-tight">{stats.activeTenants}</p>
                    </div>
                </div>

                {/* Card 3: Payments (Emerald/Teal) */}
                <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">Pending</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">Outstanding Dues</h3>
                        <p className="text-5xl font-black text-slate-900 tracking-tight">₱ {Number(stats.pendingDues).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Empty State Banner (Modern CTA Style) */}
            {stats.totalRooms === 0 && (
                <div className="mt-8 bg-gradient-to-r from-[#0B1121] to-[#1e293b] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-slate-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Set up your first property</h2>
                        <p className="text-slate-400 font-medium max-w-lg leading-relaxed">Your database is completely empty. Start by adding your first room to the system so you can begin assigning tenants and tracking revenue.</p>
                    </div>
                    <Link href="/admin/rooms" className="relative z-10 shrink-0 px-8 py-4 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/25">
                        Configure Rooms
                    </Link>
                </div>
            )}
        </div>
    );
}