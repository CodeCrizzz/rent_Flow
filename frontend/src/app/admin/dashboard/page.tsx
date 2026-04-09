"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
    rooms: { totalRooms: number; occupiedRooms: number; availableRooms: number; maintenanceRooms: number };
    tenants: { totalTenants: number; activeTenants: number; pendingTenants: number };
    billing: { monthlyIncome: number; pendingDues: number; overduePayments: number };
    maintenance: { totalRequests: number; pendingRequests: number; inProgressRequests: number; resolvedRequests: number };
    recentActivities: { id: string; type: string; title: string; description: string; date: string }[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
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

    if (isLoading || !stats || !stats.billing) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#5b21b6]/20 border-t-[#5b21b6] rounded-full animate-spin"></div>
                    <p className="text-slate-500 dark:text-zinc-500 font-bold text-sm uppercase tracking-widest">Initializing Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-10 relative">
            <div className="absolute top-0 left-10 w-96 h-96 bg-[#5b21b6]/5 dark:bg-[#5b21b6]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">System Overview</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2 transition-colors duration-500">Monitor your property's performance in real-time.</p>
                </div>
            </div>

            {/* Notifications / Alerts */}
            {(stats.billing.overduePayments > 0 || stats.tenants.pendingTenants > 0 || stats.maintenance.pendingRequests > 0) && (
                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-5 rounded-3xl flex flex-col md:flex-row gap-4 items-start md:items-center backdrop-blur-md shadow-[0_0_30px_rgba(244,63,94,0.05)] transition-colors duration-500">
                    <div className="w-10 h-10 bg-rose-100 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-500/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    </div>
                    <div className="flex-1 text-sm font-medium text-rose-600 dark:text-rose-300">
                        <span className="font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider text-xs mr-2">Attention Required:</span>
                        {stats.billing.overduePayments > 0 && <span>₱{Number(stats.billing.overduePayments).toLocaleString()} in overdue payments. </span>}
                        {stats.tenants.pendingTenants > 0 && <span>{stats.tenants.pendingTenants} pending tenant approvals. </span>}
                        {stats.maintenance.pendingRequests > 0 && <span>{stats.maintenance.pendingRequests} pending maintenance requests.</span>}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Overviews */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Billing & Room Overview Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Billing Overview */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors duration-500 shadow-xl dark:shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 dark:from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 relative z-10 transition-colors duration-500">
                                <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">💰</span>
                                Billing Overview
                            </h3>
                            <div className="space-y-5 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest transition-colors duration-500">Collected this Mo.</span>
                                    <span className="font-black text-slate-900 dark:text-white text-xl transition-colors duration-500">₱{Number(stats.billing.monthlyIncome).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-zinc-800 transition-colors duration-500"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest transition-colors duration-500">Total Unpaid</span>
                                    <span className="font-black text-amber-500 dark:text-amber-400 text-xl transition-colors duration-500">₱{Number(stats.billing.pendingDues).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-zinc-800 transition-colors duration-500"></div>
                                <div className="flex justify-between items-center bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 rounded-2xl transition-colors duration-500">
                                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Overdue Payments</span>
                                    <span className="font-black text-rose-600 dark:text-rose-400 text-xl drop-shadow-[0_0_8px_rgba(244,63,94,0.2)] dark:drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">₱{Number(stats.billing.overduePayments).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Room Status */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors duration-500 shadow-xl dark:shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 dark:from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 relative z-10 transition-colors duration-500">
                                <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(59,130,246,0.2)]">🏢</span>
                                Room Status
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest transition-colors duration-500">Total Rooms</span>
                                    <span className="font-black text-slate-900 dark:text-white text-xl transition-colors duration-500">{stats.rooms.totalRooms}</span>
                                </div>
                                {/* Sleek Progress Bar */}
                                <div className="h-2 w-full bg-slate-200 dark:bg-zinc-800/80 rounded-full flex overflow-hidden shadow-inner p-0.5 transition-colors duration-500">
                                    <div style={{width: `${(stats.rooms.occupiedRooms / Math.max(stats.rooms.totalRooms, 1)) * 100}%`}} className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(59,130,246,0.8)] relative z-10"></div>
                                    <div style={{width: `${(stats.rooms.availableRooms / Math.max(stats.rooms.totalRooms, 1)) * 100}%`}} className="bg-emerald-400 h-full rounded-full -ml-1"></div>
                                    <div style={{width: `${(stats.rooms.maintenanceRooms / Math.max(stats.rooms.totalRooms, 1)) * 100}%`}} className="bg-rose-500 h-full rounded-full -ml-1"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="bg-slate-50 dark:bg-[#0d0d0d]/40 border border-slate-200 dark:border-zinc-800 p-3 rounded-2xl transition-colors duration-500">
                                        <p className="text-blue-600 dark:text-blue-400 font-black text-xl">{stats.rooms.occupiedRooms}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mt-1 transition-colors duration-500">Occupied</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-[#0d0d0d]/40 border border-slate-200 dark:border-zinc-800 p-3 rounded-2xl transition-colors duration-500">
                                        <p className="text-emerald-600 dark:text-emerald-400 font-black text-xl">{stats.rooms.availableRooms}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mt-1 transition-colors duration-500">Available</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-[#0d0d0d]/40 border border-slate-200 dark:border-zinc-800 p-3 rounded-2xl transition-colors duration-500">
                                        <p className="text-rose-600 dark:text-rose-400 font-black text-xl">{stats.rooms.maintenanceRooms}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mt-1 transition-colors duration-500">Repair</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tenant & Maintenance Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tenant Overview */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors duration-500 shadow-xl dark:shadow-2xl flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 dark:from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 relative z-10 transition-colors duration-500">
                                <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">👥</span>
                                Tenant Overview
                            </h3>
                            <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                                <div className="w-28 h-28 rounded-full border-10 border-slate-100 dark:border-zinc-900 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative transition-colors duration-500">
                                    {/* Glowing ring */}
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="4"></circle>
                                        <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="100 100" strokeDashoffset="20"></circle>
                                    </svg>
                                    <span className="text-4xl font-black text-slate-900 dark:text-white transition-colors duration-500">{stats.tenants.activeTenants}</span>
                                </div>
                                <div className="space-y-3 flex-1 w-full">
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-[#0d0d0d]/40 border border-slate-200 dark:border-zinc-800 px-5 py-3.5 rounded-2xl transition-colors duration-500">
                                        <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest transition-colors duration-500">Active Residents</span>
                                        <span className="font-black text-slate-900 dark:text-white text-lg transition-colors duration-500">{stats.tenants.activeTenants}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-5 py-3.5 rounded-2xl transition-colors duration-500">
                                        <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Pending Approvals</span>
                                        <span className="font-black text-amber-600 dark:text-amber-400 text-lg drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] dark:drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">{stats.tenants.pendingTenants}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Maintenance Summary */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors duration-500 shadow-xl dark:shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 dark:from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 relative z-10 transition-colors duration-500">
                                <span className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(249,115,22,0.2)]">🛠️</span>
                                Maintenance Summary
                            </h3>
                            <div className="space-y-3 relative z-10">
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-[#0d0d0d]/40 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl mb-4 transition-colors duration-500">
                                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest transition-colors duration-500">Total Requests</span>
                                    <span className="font-black text-slate-900 dark:text-white text-lg transition-colors duration-500">{stats.maintenance.totalRequests}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#0d0d0d]/40 rounded-xl transition-colors duration-500">
                                    <span className="font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-3 transition-colors duration-500">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)] dark:shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                                        Pending
                                    </span>
                                    <span className="font-black text-slate-900 dark:text-white transition-colors duration-500">{stats.maintenance.pendingRequests}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#0d0d0d]/40 rounded-xl transition-colors duration-500">
                                    <span className="font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-3 transition-colors duration-500">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] dark:shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                                        In Progress
                                    </span>
                                    <span className="font-black text-slate-900 dark:text-white transition-colors duration-500">{stats.maintenance.inProgressRequests}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm px-4 py-2 hover:bg-slate-50 dark:hover:bg-[#0d0d0d]/40 rounded-xl transition-colors duration-500">
                                    <span className="font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-3 transition-colors duration-500">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] dark:shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                        Resolved
                                    </span>
                                    <span className="font-black text-slate-900 dark:text-white transition-colors duration-500">{stats.maintenance.resolvedRequests}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activities */}
                <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl h-full flex flex-col relative overflow-hidden group transition-colors duration-500">
                    <div className="absolute inset-0 bg-linear-to-b from-purple-500/10 dark:from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3 relative z-10 transition-colors duration-500">
                        <span className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(168,85,247,0.2)]">⚡</span>
                        Live Activity
                    </h3>
                    
                    {stats.recentActivities.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-3xl mb-4 border border-slate-200 dark:border-zinc-800 transition-colors duration-500">📭</div>
                            <p className="font-bold text-slate-500 dark:text-zinc-500 text-sm transition-colors duration-500">No recent activities.</p>
                        </div>
                    ) : (
                        <div className="relative border-l border-slate-200 dark:border-zinc-800 ml-4 space-y-8 pb-4 z-10 transition-colors duration-500">
                            {stats.recentActivities.map((activity, idx) => {
                                const isPayment = activity.type === 'payment';
                                const isTenant = activity.type === 'tenant';
                                const isMaintenance = activity.type === 'maintenance';
                                
                                return (
                                    <div key={activity.id} className="relative pl-8 group/item">
                                        <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-[#0a0a0a] transition-all duration-300 group-hover/item:scale-150 ${
                                            isPayment ? 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] dark:shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 
                                            isTenant ? 'bg-blue-500 dark:bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)] dark:shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 
                                            'bg-orange-500 dark:bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)] dark:shadow-[0_0_10px_rgba(251,146,60,0.8)]'
                                        }`}></div>
                                        
                                        <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-1 transition-colors duration-500">{new Date(activity.date).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1 transition-colors duration-500">{activity.title}</p>
                                        <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 leading-relaxed transition-colors duration-500">{activity.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}