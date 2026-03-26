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
                    <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold text-sm">Please ensure the backend is running the latest changes.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 font-medium mt-2">Monitor your property's performance at a glance.</p>
                </div>
            </div>

            {/* Notifications / Alerts */}
            {(stats.billing.overduePayments > 0 || stats.tenants.pendingTenants > 0 || stats.maintenance.pendingRequests > 0) && (
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    </div>
                    <div className="flex-1 text-sm font-medium text-rose-800">
                        <span className="font-bold">Attention Needed: </span>
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
                        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">💰</span>
                                Billing Overview
                            </h3>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-500">Collected this Mo.</span>
                                    <span className="font-black text-slate-900 text-lg">₱{Number(stats.billing.monthlyIncome).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-slate-100"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-500">Total Unpaid</span>
                                    <span className="font-black text-amber-600 text-lg">₱{Number(stats.billing.pendingDues).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-slate-100"></div>
                                <div className="flex justify-between items-center bg-rose-50 p-3 rounded-xl">
                                    <span className="text-sm font-black text-rose-600">Overdue Payments</span>
                                    <span className="font-black text-rose-600 text-lg">₱{Number(stats.billing.overduePayments).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Room Status */}
                        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">🏢</span>
                                Room Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-500">Total Rooms</span>
                                    <span className="font-black text-slate-900">{stats.rooms.totalRooms}</span>
                                </div>
                                {/* Progress Bar Vis */}
                                <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                                    <div style={{width: `${(stats.rooms.occupiedRooms / Math.max(stats.rooms.totalRooms, 1)) * 100}%`}} className="bg-indigo-500 h-full"></div>
                                    <div style={{width: `${(stats.rooms.availableRooms / Math.max(stats.rooms.totalRooms, 1)) * 100}%`}} className="bg-emerald-400 h-full"></div>
                                    <div style={{width: `${(stats.rooms.maintenanceRooms / Math.max(stats.rooms.totalRooms, 1)) * 100}%`}} className="bg-rose-400 h-full"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                                    <div className="bg-indigo-50 p-2 rounded-xl">
                                        <p className="text-indigo-600 font-black text-lg">{stats.rooms.occupiedRooms}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Occupied</p>
                                    </div>
                                    <div className="bg-emerald-50 p-2 rounded-xl">
                                        <p className="text-emerald-600 font-black text-lg">{stats.rooms.availableRooms}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Available</p>
                                    </div>
                                    <div className="bg-rose-50 p-2 rounded-xl">
                                        <p className="text-rose-600 font-black text-lg">{stats.rooms.maintenanceRooms}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-rose-400">Repair</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tenant & Maintenance Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tenant Overview */}
                        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-center">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">👥</span>
                                Tenant Overview
                            </h3>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full border-8 border-indigo-50 flex items-center justify-center shrink-0">
                                    <span className="text-3xl font-black text-indigo-600">{stats.tenants.activeTenants}</span>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-lg">
                                        <span className="text-xs font-bold text-slate-500">Active Tenants</span>
                                        <span className="font-black text-slate-900">{stats.tenants.activeTenants}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-amber-50 px-4 py-2 rounded-lg">
                                        <span className="text-xs font-bold text-amber-700">Pending Approvals</span>
                                        <span className="font-black text-amber-600">{stats.tenants.pendingTenants}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Maintenance Summary */}
                        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">🛠️</span>
                                Maintenance Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="font-bold text-slate-600">Total Requests</span>
                                    <span className="font-black text-slate-900">{stats.maintenance.totalRequests}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-2 px-3">
                                    <span className="font-bold text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div>Pending</span>
                                    <span className="font-black text-slate-900">{stats.maintenance.pendingRequests}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-2 px-3">
                                    <span className="font-bold text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div>In Progress</span>
                                    <span className="font-black text-slate-900">{stats.maintenance.inProgressRequests}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-2 px-3">
                                    <span className="font-bold text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Resolved</span>
                                    <span className="font-black text-slate-900">{stats.maintenance.resolvedRequests}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activities */}
                <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] h-full flex flex-col">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">⚡</span>
                        Recent Activities
                    </h3>
                    
                    {stats.recentActivities.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="font-bold text-slate-400 text-sm">No recent activities.</p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
                            {stats.recentActivities.map((activity, idx) => {
                                const isPayment = activity.type === 'payment';
                                const isTenant = activity.type === 'tenant';
                                const isMaintenance = activity.type === 'maintenance';
                                
                                return (
                                    <div key={activity.id} className="relative pl-6">
                                        {/* Timeline Dot */}
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${
                                            isPayment ? 'bg-emerald-500' : isTenant ? 'bg-indigo-500' : 'bg-orange-500'
                                        }`}></div>
                                        
                                        <p className="text-xs font-black text-slate-400 mb-1">{new Date(activity.date).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                                        <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                                        <p className="text-sm font-medium text-slate-500 mt-1">{activity.description}</p>
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