"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

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

    if (isLoading) return <div className="p-8 font-bold text-slate-500 animate-pulse">Loading real data from PostgreSQL...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Live data fetched from PostgreSQL.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/rooms" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm flex items-center gap-2">
                        Add Room
                    </Link>
                </div>
            </div>

            {/* LIVE Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Rooms</h3>
                    <p className="text-4xl font-black text-slate-900">{stats.totalRooms}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Active Tenants</h3>
                    <p className="text-4xl font-black text-slate-900">{stats.activeTenants}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Pending Dues</h3>
                    <p className="text-4xl font-black text-slate-900">₱ {Number(stats.pendingDues).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}