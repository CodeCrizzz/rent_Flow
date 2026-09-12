"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { motion, Variants } from "framer-motion";
import { 
    Users, UserCheck, UserPlus, UserX,
    Building2, DoorOpen, DoorClosed, XCircle,
    Receipt, DollarSign, Wallet, AlertCircle,
    Wrench, Clock, Activity, CheckCircle,
    MessageSquare, Bell, Calendar, Plus, CreditCard
} from 'lucide-react';

interface ExpiringContract {
    id: number;
    name: string;
    room_number: string | null;
    contract_end_date: string;
    days_left: number;
}

interface DashboardStats {
    rooms: { totalRooms: number; occupiedRooms: number; availableRooms: number; maintenanceRooms: number; unavailableRooms: number };
    tenants: { totalTenants: number; activeTenants: number; pendingTenants: number; inactiveTenants: number };
    billing: { monthlyIncome: number; pendingDues: number; overduePayments: number; totalBilled: number; collectionRate: number; historicalIncome?: { year: number, month: number, total: number }[] };
    maintenance: { totalRequests: number; pendingRequests: number; inProgressRequests: number; resolvedRequests: number };
    recentActivities: { id: string; type: string; title: string; description: string; date: string }[];
    recentMessages: { id: number; tenant_name: string; message: string; status: string; created_at: string }[];
    pendingTenantsList: { id: number; name: string; email: string; created_at: string }[];
    recentPayments: { id: number; tenant_name: string; amount_paid: string; payment_date: string }[];
    recentRequests: { id: number; tenant_name: string; title: string; created_at: string }[];
    expiringContracts: ExpiringContract[];
    overdueAccounts: { tenant_id: number; tenant_name: string; room_number: string | null; total_overdue: number }[];
    upcomingRent: { id: number; tenant_name: string; room_number: string | null; balance: number; due_date: string }[];
}

// Framer Motion Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonths, setSelectedMonths] = useState<number>(6);
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(new Date().toLocaleDateString(undefined, options));

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
                    <div className="w-16 h-16 border-4 border-slate-200 dark:border-zinc-800 border-t-[#5b21b6] dark:border-t-[#8b5cf6] rounded-full animate-spin relative z-10"></div>
                    <p className="text-slate-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-[0.2em] mt-6 relative z-10 animate-pulse">Initializing Dashboard...</p>
                </div>
            </div>
        );
    }

    // Generate dynamic chart data based on selected timeframe
    const generateChartData = (numMonths: number) => {
        if (!stats?.billing) return [];
        const historical = stats.billing.historicalIncome || [];
        const data = [];
        const now = new Date();
        
        for (let i = numMonths - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const found = historical.find(h => h.year === d.getFullYear() && h.month === (d.getMonth() + 1));
            data.push({
                month: monthName,
                revenue: found ? found.total : 0
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
            className="max-w-[1600px] mx-auto pb-24 space-y-6"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 dark:bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none -z-10"></div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back, Admin</h1>
                    <p className="text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {currentDate}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/tenants" className="bg-slate-900 dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Tenant
                    </Link>
                    <Link href="/admin/billing" className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 px-4 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Record Payment
                    </Link>
                </div>
            </motion.div>

            {/* Overview Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* Tenant Overview */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-700 dark:text-zinc-300">Tenant Overview</h3>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Total</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-500" />{stats.tenants.totalTenants}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Active</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-emerald-500" />{stats.tenants.activeTenants}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Pending</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5 text-amber-500" />{stats.tenants.pendingTenants}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Inactive</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><UserX className="w-3.5 h-3.5 text-rose-500" />{stats.tenants.inactiveTenants}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Room Overview */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-700 dark:text-zinc-300">Room Overview</h3>
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Building2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Total</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-emerald-500" />{stats.rooms.totalRooms}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Occupied</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><DoorClosed className="w-3.5 h-3.5 text-emerald-500" />{stats.rooms.occupiedRooms}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Available</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><DoorOpen className="w-3.5 h-3.5 text-cyan-500" />{stats.rooms.availableRooms}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Unavailable</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-rose-500" />{stats.rooms.unavailableRooms}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Billing Overview */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-700 dark:text-zinc-300">Billing Overview</h3>
                        <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                            <Receipt className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Billed</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1">₱{stats.billing.totalBilled >= 1000 ? (stats.billing.totalBilled/1000).toFixed(1)+'k' : stats.billing.totalBilled}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Collected</span>
                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">₱{Number(stats.billing.monthlyIncome) >= 1000 ? (Number(stats.billing.monthlyIncome)/1000).toFixed(1)+'k' : Number(stats.billing.monthlyIncome)}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Outstanding</span>
                            <span className="text-lg font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">₱{stats.billing.pendingDues >= 1000 ? (stats.billing.pendingDues/1000).toFixed(1)+'k' : stats.billing.pendingDues}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Overdue</span>
                            <span className="text-lg font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">₱{stats.billing.overduePayments >= 1000 ? (stats.billing.overduePayments/1000).toFixed(1)+'k' : stats.billing.overduePayments}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Maintenance Overview */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-700 dark:text-zinc-300">Maintenance Overview</h3>
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Wrench className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Total</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-orange-500" />{stats.maintenance.totalRequests}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Pending</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" />{stats.maintenance.pendingRequests}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">In Progress</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-cyan-500" />{stats.maintenance.inProgressRequests}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block mb-1">Resolved</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />{stats.maintenance.resolvedRequests}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lists Column 1 */}
                <div className="space-y-6 lg:col-span-2">
                    
                    {/* Chart Section */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500" /> Collection Overview</h2>
                                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Monthly billing vs collection performance</p>
                            </div>
                            <select 
                                value={selectedMonths}
                                onChange={(e) => setSelectedMonths(Number(e.target.value))}
                                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-sm rounded-xl px-3 py-1.5 outline-hidden cursor-pointer"
                            >
                                <option value={6}>Last 6 Months</option>
                                <option value={12}>Last 12 Months</option>
                            </select>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.1)" />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#71717a', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#71717a', fontSize: 12 }}
                                        tickFormatter={(value) => `₱${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Collected']}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Pending Registrations & Recent Payments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pending Tenants */}
                        <motion.div variants={itemVariants} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col h-80 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2"><UserPlus className="w-4 h-4 text-amber-500" /> Pending Registrations</h3>
                                <Link href="/admin/tenants" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold">Manage</Link>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {stats.pendingTenantsList.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600">
                                        <UserCheck className="w-8 h-8 mb-2 opacity-50" />
                                        <p className="text-sm">No pending registrations</p>
                                    </div>
                                ) : (
                                    stats.pendingTenantsList.map(t => (
                                        <div key={t.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400">{t.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] uppercase tracking-wider font-black text-slate-400">{new Date(t.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* Recent Payments */}
                        <motion.div variants={itemVariants} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col h-80 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" /> Recent Payments</h3>
                                <Link href="/admin/billing" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold">View all</Link>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {stats.recentPayments.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600">
                                        <Wallet className="w-8 h-8 mb-2 opacity-50" />
                                        <p className="text-sm">No recent payments</p>
                                    </div>
                                ) : (
                                    stats.recentPayments.map(p => (
                                        <div key={p.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">{p.tenant_name}</p>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400">{new Date(p.payment_date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">+₱{Number(p.amount_paid).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Lists Column 2 */}
                <div className="space-y-6">
                    {/* Recent Maintenance Requests */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col h-[340px] overflow-hidden relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2"><Wrench className="w-4 h-4 text-orange-500" /> Recent Maintenance</h3>
                            <Link href="/admin/requests" className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-bold">View all</Link>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {stats.recentRequests.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600">
                                    <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="text-sm">No recent requests</p>
                                </div>
                            ) : (
                                stats.recentRequests.map(r => (
                                    <div key={r.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col justify-center">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{r.title}</p>
                                        <div className="flex justify-between mt-1 items-center">
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">{r.tenant_name}</p>
                                            <span className="text-[10px] uppercase tracking-wider font-black text-slate-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Messages */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col h-[340px] overflow-hidden relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-500" /> Recent Messages</h3>
                            <Link href="/admin/chat" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold">Reply all</Link>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {stats.recentMessages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600">
                                    <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="text-sm">No recent messages</p>
                                </div>
                            ) : (
                                stats.recentMessages.map(m => (
                                    <div key={m.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 relative">
                                        {m.status === 'unread' && <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>}
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">{m.tenant_name}</p>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">{m.message}</p>
                                        <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block mt-1">{new Date(m.created_at).toLocaleDateString()}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}