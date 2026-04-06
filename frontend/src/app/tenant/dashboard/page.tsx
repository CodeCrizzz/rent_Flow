"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function TenantDashboard() {
    const [tenantData, setTenantData] = useState({ balanceDue: 0, recentTransactions: [] });
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setUserName(JSON.parse(userStr).name);

        const fetchTenantData = async () => {
            try {
                const { data } = await api.get('/tenant/dashboard');
                setTenantData(data);
            } catch (error) {
                console.error("Failed to fetch tenant data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTenantData();
    }, []);

    const [isPaying, setIsPaying] = useState(false);
    const [payStatus, setPayStatus] = useState<string | null>(null);

    const handlePayment = async () => {
        setIsPaying(true);
        setPayStatus(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setPayStatus('Success! Payment processed.');
            setTenantData(prev => ({ ...prev, balanceDue: 0 }));
            setTimeout(() => setPayStatus(null), 5000);
        } catch (error) {
            console.error("Payment failed:", error);
        } finally {
            setIsPaying(false);
        }
    };

    if (isLoading) return <div className="font-bold text-slate-400 text-sm animate-pulse p-10">Loading workspace...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-10 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute top-0 left-10 w-96 h-96 bg-[#5b21b6]/5 dark:bg-[#5b21b6]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            {/* Header Area */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Dashboard Overview</h1>
                <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2 transition-colors duration-500">Hello, {userName.split(' ')[0]}! Real-time overview of your stay.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* Card 1: Balance */}
                <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors duration-500 shadow-xl dark:shadow-2xl relative overflow-hidden group md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 dark:from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-200 dark:border-emerald-500/20 group-hover:border-transparent">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 px-3 py-1.5 rounded-xl">Payment Due</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-1">Current Balance</h3>
                        <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6 transition-colors duration-500">₱{Number(tenantData.balanceDue).toLocaleString()}</p>
                        
                        {payStatus ? (
                            <div className="w-full py-4 bg-emerald-500 text-white text-center font-black rounded-2xl animate-in zoom-in-95 duration-500 uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20">
                                {payStatus}
                            </div>
                        ) : (
                            <button 
                                onClick={handlePayment}
                                disabled={isPaying || tenantData.balanceDue === 0}
                                className={`w-full px-4 py-4 font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase text-xs tracking-widest ${
                                    isPaying ? 'bg-slate-100 text-slate-400 cursor-wait dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800' : 
                                    tenantData.balanceDue === 0 ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100 dark:bg-zinc-900/30 dark:border-zinc-800/50' :
                                    'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white'
                                }`}
                            >
                                {isPaying && <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>}
                                {isPaying ? 'Processing...' : tenantData.balanceDue === 0 ? 'Fully Paid' : 'Pay Now'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Card 2: Status */}
                <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors duration-500 shadow-xl dark:shadow-2xl relative overflow-hidden group flex flex-col justify-between">
                    <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 dark:from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(139,92,246,0.2)] border border-violet-200 dark:border-violet-500/20 group-hover:border-transparent">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 px-3 py-1.5 rounded-xl">Accommodation</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-1">Status</h3>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Pending</p>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-3 font-medium leading-relaxed">The admin will assign your room shortly. You'll be notified via message.</p>
                    </div>
                </div>

                {/* Card 3: Inbox */}
                <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors duration-500 shadow-xl dark:shadow-2xl relative overflow-hidden group flex flex-col justify-between">
                    <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 dark:from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-cyan-200 dark:border-cyan-500/20 group-hover:border-transparent">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 px-3 py-1.5 rounded-xl">Communications</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-1">Messages</h3>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">All Clear</p>
                        <Link href="/tenant/chat" className="inline-flex items-center mt-5 text-sm font-black text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors uppercase tracking-widest">
                            Contact Admin 
                            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}