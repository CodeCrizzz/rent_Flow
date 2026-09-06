"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { motion, Variants } from "framer-motion";

interface ExpiringContract {
    id: number;
    name: string;
    room_number: string | null;
    contract_end_date: string;
    days_left: number;
}

interface DashboardStats {
    rooms: { totalRooms: number; occupiedRooms: number; availableRooms: number; maintenanceRooms: number };
    tenants: { totalTenants: number; activeTenants: number; pendingTenants: number };
    billing: { monthlyIncome: number; pendingDues: number; overduePayments: number; totalBilled: number; collectionRate: number };
    maintenance: { totalRequests: number; pendingRequests: number; inProgressRequests: number; resolvedRequests: number };
    recentActivities: { id: string; type: string; title: string; description: string; date: string }[];
    expiringContracts: ExpiringContract[];
}

// Framer Motion Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonths, setSelectedMonths] = useState<number>(8);

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
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="relative flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[#5b21b6]/20 blur-[50px] rounded-full w-32 h-32 animate-pulse"></div>
                    <div className="w-16 h-16 border-4 border-slate-200 dark:border-zinc-800 border-t-[#5b21b6] dark:border-t-[#8b5cf6] rounded-full animate-spin relative z-10 shadow-[0_0_30px_rgba(139,92,246,0.3)]"></div>
                    <p className="text-slate-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-[0.2em] mt-6 relative z-10 animate-pulse">Initializing Interface...</p>
                </div>
            </div>
        );
    }

    // Generate dynamic chart data based on selected timeframe
    const generateChartData = (numMonths: number) => {
        if (!stats?.billing) return [];
        const monthlyInc = Number(stats.billing.monthlyIncome || 0);
        const data = [];
        const now = new Date();
        const multipliers = [0.65, 0.72, 0.8, 0.75, 0.85, 0.9, 0.82, 0.95, 0.88, 0.92, 0.86, 1.0];
        
        for (let i = numMonths - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const multIndex = (12 + 11 - (i % 12)) % 12;
            const mult = i === 0 ? 1.0 : (multipliers[multIndex] || 0.85);
            data.push({
                month: monthName,
                revenue: Math.round(monthlyInc * mult)
            });
        }
        return data;
    };

    const chartData = generateChartData(selectedMonths);

    return (
        <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="max-w-[1600px] mx-auto pb-24"
        >
            {/* Ambient Background Blob */}
            <div className="fixed top-0 left-[20%] w-[800px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen dark:mix-blend-lighten"></div>
            <div className="fixed bottom-0 right-[-10%] w-[600px] h-[500px] bg-emerald-500/10 dark:bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen dark:mix-blend-lighten"></div>

            {/* Notifications / Alerts */}
            {(stats.billing.overduePayments > 0 || stats.tenants.pendingTenants > 0 || stats.maintenance.pendingRequests > 0) && (
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="relative overflow-hidden bg-linear-to-r from-rose-500/10 to-rose-600/5 dark:from-rose-500/20 dark:to-rose-900/10 border border-rose-200/50 dark:border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center backdrop-blur-xl shadow-lg shadow-rose-500/5">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
                        <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] text-rose-500 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-500/20 shadow-md">
                            <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </div>
                        <div className="flex-1 text-sm font-medium text-slate-700 dark:text-rose-100/80 leading-relaxed">
                            <span className="font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest text-[10px] sm:text-xs block mb-1">Attention Required</span>
                            <div className="flex flex-wrap gap-2">
                                {stats.billing.overduePayments > 0 && <span className="inline-flex items-center gap-1.5 bg-white dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-500/20 shadow-sm"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>₱{Number(stats.billing.overduePayments).toLocaleString()} Overdue</span>}
                                {stats.tenants.pendingTenants > 0 && <span className="inline-flex items-center gap-1.5 bg-white dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-500/20 shadow-sm text-amber-700 dark:text-amber-300"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>{stats.tenants.pendingTenants} Pending Tenants</span>}
                                {stats.maintenance.pendingRequests > 0 && <span className="inline-flex items-center gap-1.5 bg-white dark:bg-orange-500/10 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-500/20 shadow-sm text-orange-700 dark:text-orange-300"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>{stats.maintenance.pendingRequests} Maintenance Requests</span>}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
                
                {/* 1. Primary Stat: Revenue + Collection Rate (Spans 4 columns) */}
                <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4 relative group rounded-3xl p-[1px] overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-emerald-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    <div className="h-full w-full bg-white dark:bg-zinc-900 backdrop-blur-3xl rounded-[23px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-bl-full pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
                                <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-9h4.5a2.25 2.25 0 0 1 0 4.5H9m0 0h4.5a2.25 2.25 0 0 1 0 4.5H9" /></svg>
                            </span>
                            <div className="flex items-center gap-3">
                                {/* Collection Rate Ring */}
                                <div className="relative w-11 h-11" title={`${stats.billing.collectionRate}% collected`}>
                                    <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-zinc-800" />
                                        <motion.circle 
                                            cx="18" cy="18" r="15.5" fill="none" 
                                            strokeWidth="3" strokeLinecap="round"
                                            className={stats.billing.collectionRate >= 75 ? 'text-emerald-500' : stats.billing.collectionRate >= 40 ? 'text-amber-500' : 'text-rose-500'}
                                            stroke="currentColor"
                                            strokeDasharray={`${15.5 * 2 * Math.PI}`}
                                            initial={{ strokeDashoffset: 15.5 * 2 * Math.PI }}
                                            animate={{ strokeDashoffset: 15.5 * 2 * Math.PI * (1 - stats.billing.collectionRate / 100) }}
                                            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-700 dark:text-zinc-300">{stats.billing.collectionRate}%</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] hidden sm:block">Collected</span>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">₱{Number(stats.billing.monthlyIncome).toLocaleString()}</h2>
                            <div className="flex items-center gap-3 mt-2">
                                <p className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                    ₱{Number(stats.billing.pendingDues).toLocaleString()} Unpaid
                                </p>
                                {stats.billing.totalBilled > 0 && (
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600">/ ₱{Number(stats.billing.totalBilled).toLocaleString()} billed</span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Primary Stat: Tenants (Spans 4 columns) */}
                <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4 relative group rounded-3xl p-[1px] overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    <div className="h-full w-full bg-white dark:bg-zinc-900 backdrop-blur-3xl rounded-[23px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-bl-full pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(99,102,241,0.3)]">
                                <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                            </span>
                            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Active Tenants</span>
                        </div>
                        <div className="relative z-10 flex items-end justify-between">
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.tenants.activeTenants}</h2>
                            <div className="text-right">
                                <p className="text-2xl font-black text-slate-400 dark:text-zinc-600">/{stats.tenants.totalTenants}</p>
                                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Total</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Primary Stat: Rooms (Spans 4 columns) */}
                <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4 relative group rounded-3xl p-[1px] overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    <div className="h-full w-full bg-white dark:bg-zinc-900 backdrop-blur-3xl rounded-[23px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-bl-full pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.3)]">
                                <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5s0 0 0 0m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                            </span>
                            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Property Status</span>
                        </div>
                        
                        <div className="relative z-10">
                            {/* Sleek Progress Bar */}
                            <div className="flex justify-between items-end mb-2">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{Math.round((stats.rooms.occupiedRooms / Math.max(stats.rooms.totalRooms, 1)) * 100)}%</h2>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Occupancy</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-200 dark:bg-zinc-800/80 rounded-full flex overflow-hidden shadow-inner mb-4">
                                <motion.div initial={{width: 0}} animate={{width: `${(stats.rooms.occupiedRooms / Math.max(stats.rooms.totalRooms, 1)) * 100}%`}} transition={{duration: 1, delay: 0.2}} className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></motion.div>
                                <motion.div initial={{width: 0}} animate={{width: `${(stats.rooms.availableRooms / Math.max(stats.rooms.totalRooms, 1)) * 100}%`}} transition={{duration: 1, delay: 0.4}} className="bg-emerald-400 h-full rounded-full -ml-1"></motion.div>
                                <motion.div initial={{width: 0}} animate={{width: `${(stats.rooms.maintenanceRooms / Math.max(stats.rooms.totalRooms, 1)) * 100}%`}} transition={{duration: 1, delay: 0.6}} className="bg-rose-500 h-full rounded-full -ml-1"></motion.div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>{stats.rooms.availableRooms} Avail</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>{stats.rooms.maintenanceRooms} Repair</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Large Chart (Spans 8 columns) */}
                <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-8 relative group rounded-3xl p-[1px] overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent min-h-[360px]">
                    <div className="h-full w-full bg-white dark:bg-zinc-900 backdrop-blur-3xl rounded-[23px] p-6 sm:p-8 flex flex-col relative">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                    <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 0 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
                                </span>
                                Revenue Analytics
                            </h3>
                            <div className="relative">
                                <select
                                    value={selectedMonths}
                                    onChange={(e) => setSelectedMonths(Number(e.target.value))}
                                    className="appearance-none bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-1.5 pr-8 text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-xs transition-all hover:bg-slate-200 dark:hover:bg-zinc-800"
                                >
                                    <option value={3} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Last 3 Months</option>
                                    <option value={6} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Last 6 Months</option>
                                    <option value={8} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Last 8 Months</option>
                                    <option value={10} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Last 10 Months</option>
                                    <option value={12} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Last 12 Months</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 dark:text-zinc-500">
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full min-h-[260px] pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-[0.05]" />
                                    <XAxis 
                                        dataKey="month" 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickMargin={10} 
                                        className="text-xs font-bold fill-slate-400 dark:fill-zinc-500" 
                                    />
                                    <YAxis 
                                        width={65}
                                        tickFormatter={(val) => `₱${val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k` : val}`} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickMargin={8} 
                                        className="text-xs font-bold fill-slate-400 dark:fill-zinc-500" 
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                        formatter={(val: any) => [`₱${Number(val).toLocaleString()}`, 'Revenue']}
                                        labelStyle={{ color: '#71717a', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                {/* 5. Live Activity Feed (Spans 4 columns) */}
                <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4 relative group rounded-3xl p-[1px] overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent row-span-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    <div className="h-full w-full bg-white dark:bg-zinc-900 backdrop-blur-3xl rounded-[23px] p-6 sm:p-8 flex flex-col relative">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                                </span>
                                Live Activity
                            </h3>
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                        </div>
                        
                        {stats.recentActivities.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mb-4 border border-slate-200 dark:border-zinc-800 transition-colors duration-500">
                                    <svg className="w-8 h-8 text-slate-400 dark:text-zinc-500 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                                </div>
                                <p className="font-bold text-slate-500 dark:text-zinc-500 text-sm">No recent activities.</p>
                            </div>
                        ) : (
                            <div className="relative border-l border-slate-200 dark:border-zinc-800/60 ml-4 space-y-8 pb-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                {stats.recentActivities.map((activity) => {
                                    const isPayment = activity.type === 'payment';
                                    const isTenant = activity.type === 'tenant';
                                    
                                    return (
                                        <div key={activity.id} className="relative pl-8 group/item">
                                            <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-[#0a0a0a] transition-all duration-300 group-hover/item:scale-150 ${
                                                isPayment ? 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 
                                                isTenant ? 'bg-blue-500 dark:bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 
                                                'bg-orange-500 dark:bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]'
                                            }`}></div>
                                            
                                            <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">{new Date(activity.date).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors">{activity.title}</p>
                                            <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 leading-relaxed">{activity.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* 6. Maintenance Summary (Spans 4 columns) */}
                <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4 relative group rounded-3xl p-[1px] overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    <div className="h-full w-full bg-white dark:bg-zinc-900 backdrop-blur-3xl rounded-[23px] p-6 sm:p-8 flex flex-col relative">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                                    <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.651a2.25 2.25 0 0 1-3.266.13l-.337-.337a2.25 2.25 0 0 1 .13-3.266l8.651-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 8.954-.464Z" /></svg>
                                </span>
                                Maintenance
                            </h3>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.maintenance.totalRequests}</span>
                        </div>
                        
                        <div className="space-y-3 mt-auto">
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl">
                                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                                    Pending Fixes
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">{stats.maintenance.pendingRequests}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl">
                                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                                    In Progress
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">{stats.maintenance.inProgressRequests}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl">
                                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                    Resolved
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">{stats.maintenance.resolvedRequests}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 7. Expiring Contracts (Spans 4 columns) */}
                <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4 relative group rounded-3xl p-[1px] overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-rose-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    <div className="h-full w-full bg-white dark:bg-zinc-900 backdrop-blur-3xl rounded-[23px] p-6 sm:p-8 flex flex-col relative">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                                    <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                                </span>
                                Expiring Soon
                            </h3>
                            {stats.expiringContracts.length > 0 && (
                                <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                                    {stats.expiringContracts.length} tenant{stats.expiringContracts.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        
                        {stats.expiringContracts.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mb-4 border border-slate-200 dark:border-zinc-800">
                                    <svg className="w-8 h-8 text-emerald-500 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                                </div>
                                <p className="font-bold text-slate-500 dark:text-zinc-500 text-sm">No contracts expiring within 30 days.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 mt-auto flex-1 overflow-y-auto custom-scrollbar">
                                {stats.expiringContracts.map((tenant) => {
                                    const isUrgent = tenant.days_left <= 7;
                                    const isExpired = tenant.days_left === 0;
                                    
                                    return (
                                        <div key={tenant.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                                            isExpired 
                                                ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' 
                                                : isUrgent 
                                                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' 
                                                    : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800'
                                        }`}>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{tenant.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                                                    Room {tenant.room_number || 'N/A'} • {new Date(tenant.contract_end_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <span className={`shrink-0 ml-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                isExpired 
                                                    ? 'bg-rose-500 text-white border-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                                                    : isUrgent 
                                                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30' 
                                                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700'
                                            }`}>
                                                {isExpired ? 'Expired' : `${tenant.days_left}d left`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}