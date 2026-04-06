"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';


export default function TenantDashboard() {
    const [tenantData, setTenantData] = useState<{
        balanceDue: number;
        recentTransactions: any[];
    }>({
        balanceDue: 0,
        recentTransactions: []
    });
    
    const [userName, setUserName] = useState('');
    const [displayBalance, setDisplayBalance] = useState(0);

    useEffect(() => {
        // Safe check for localStorage
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) setUserName(JSON.parse(userStr).name);
        }
    }, []);

    // Number Counter Animation Effect
    useEffect(() => {
        if (tenantData.balanceDue > 0) {
            let start = 0;
            const end = tenantData.balanceDue;
            const duration = 1000; 
            const increment = end / (duration / 16); 
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setDisplayBalance(end);
                    clearInterval(timer);
                } else {
                    setDisplayBalance(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        } else {
            setDisplayBalance(0);
        }
    }, [tenantData.balanceDue]);

    const [isPaying, setIsPaying] = useState(false);
    const [payStatus, setPayStatus] = useState<string | null>(null);

    const handlePayment = async () => {
        setIsPaying(true);
        setPayStatus(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setPayStatus('Payment Verified');
            setTenantData(prev => ({ ...prev, balanceDue: 0 }));
            setTimeout(() => setPayStatus(null), 5000);
        } catch (error) {
            console.error("Payment failed:", error);
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="min-h-screen text-slate-800 dark:text-white selection:bg-blue-500/30 relative font-sans flex flex-col overflow-x-hidden pt-10 pb-20">
            <div className="fixed inset-0 w-full h-full bg-slate-50 dark:bg-[#020617] -z-[100] transition-colors duration-500 pointer-events-none"></div>

            {/* Custom Animations */}
            <style>{`
                .glass-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.04;
                    mix-blend-mode: overlay;
                    pointer-events: none;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-6 w-full space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative">
                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-[10px] uppercase font-black tracking-[0.2em] mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            Tenant Portal Active
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                            Welcome back,<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">{userName.split(' ')[0] || 'Resident'}</span>.
                        </h1>
                    </div>
                </div>

                {/* --- BENTO GRID LAYOUT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* HERO CARD: Billing & Balance (Spans 2 columns) with Holographic Border */}
                    <div className="lg:col-span-2 relative p-[1px] rounded-[2.5rem] overflow-hidden group">
                        {/* Spinning Gradient Border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        {/* Card Body */}
                        <div className="relative h-full bg-white dark:bg-[#0a0f1c]/90 rounded-[calc(2.5rem-1px)] p-8 md:p-10 backdrop-blur-xl border border-slate-200 dark:border-blue-900/30 flex flex-col justify-between overflow-hidden">
                            <div className="absolute inset-0 glass-noise"></div>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3 group-hover:scale-150 transition-transform duration-1000"></div>
                            
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 mb-6 shadow-[0_0_20px_rgba(37,99,235,0.15)] border border-blue-100 dark:border-cyan-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h3 className="text-xs font-black text-slate-500 dark:text-blue-200/50 uppercase tracking-[0.25em]">Total Outstanding</h3>
                                    <p className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mt-2 drop-shadow-sm">
                                        ₱{displayBalance.toLocaleString()}
                                        <span className="text-3xl text-slate-300 dark:text-blue-800/80">.00</span>
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 mt-10 flex flex-col sm:flex-row gap-6 items-end justify-between">
                                <p className="text-sm text-slate-500 dark:text-blue-100/60 font-medium max-w-xs leading-relaxed">
                                    Next billing cycle generates on the 1st. Settle your balance securely below.
                                </p>
                                
                                {payStatus ? (
                                    <div className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center font-black rounded-2xl animate-in zoom-in duration-500 uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            {payStatus}
                                        </span>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handlePayment}
                                        disabled={isPaying || tenantData.balanceDue === 0}
                                        className={`relative overflow-hidden w-full sm:w-auto px-10 py-5 font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] group/btn ${
                                            isPaying ? 'bg-slate-100 text-slate-400 cursor-wait dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700' : 
                                            tenantData.balanceDue === 0 ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100 dark:bg-[#0f172a] dark:border-slate-800/50' :
                                            'bg-slate-900 text-white shadow-xl hover:scale-105 dark:bg-white dark:text-slate-900 dark:hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]'
                                        }`}
                                    >
                                        {!isPaying && tenantData.balanceDue > 0 && <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-blue-500/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></span>}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {isPaying && <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>}
                                            {isPaying ? 'Processing...' : tenantData.balanceDue === 0 ? 'Account Settled' : 'Secure Payment'}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SIDE STACK: Status & Messages */}
                    <div className="flex flex-col gap-6">
                        {/* Status Card */}
                        <div className="bg-white dark:bg-[#0a0f1c]/80 p-8 rounded-[2.5rem] border border-slate-200 dark:border-blue-900/30 shadow-lg relative overflow-hidden group flex-1 flex flex-col justify-center backdrop-blur-xl hover:-translate-y-1 transition-all duration-500 cursor-default">
                            <div className="absolute inset-0 glass-noise"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative z-10 flex items-center justify-between mb-6">
                                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-blue-200/50 border border-slate-200 dark:border-blue-800/50 px-3 py-1.5 rounded-xl">Unit Status</span>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                    </span>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Pending</p>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-blue-100/60 mt-2 font-medium">Awaiting administrator room assignment.</p>
                            </div>
                        </div>

                        {/* Messages Card */}
                        <div className="bg-white dark:bg-[#0a0f1c]/80 p-8 rounded-[2.5rem] border border-slate-200 dark:border-blue-900/30 shadow-lg relative overflow-hidden group flex-1 flex flex-col justify-center backdrop-blur-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer dark:hover:border-cyan-500/50 dark:hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)]">
                            <div className="absolute inset-0 glass-noise"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative z-10 flex items-center justify-between mb-6">
                                <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-blue-200/50 border border-slate-200 dark:border-blue-800/50 px-3 py-1.5 rounded-xl">Communications</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">0 Unread</p>
                                <Link href="/tenant/chat" className="inline-flex items-center mt-3 text-xs font-black text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors uppercase tracking-[0.1em]">
                                    Open Comm-Link <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TRANSACTIONS LEDGER SECTION --- */}
                <div className="bg-white dark:bg-[#0a0f1c]/90 rounded-[2.5rem] border border-slate-200 dark:border-blue-900/30 shadow-xl overflow-hidden backdrop-blur-xl relative">
                    <div className="absolute inset-0 glass-noise z-0"></div>
                    
                    <div className="p-8 md:px-10 border-b border-slate-100 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Financial Ledger</h2>
                            <p className="text-xs font-medium text-slate-500 dark:text-blue-200/50 mt-1 uppercase tracking-[0.15em]">Recent 30 Days</p>
                        </div>
                        <button className="self-start sm:self-auto px-5 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/50 text-slate-700 dark:text-cyan-400 rounded-xl transition-all duration-300 border border-slate-200 dark:border-blue-800/50 text-xs font-black uppercase tracking-widest flex items-center gap-2 group/download">
                            Download PDF
                            <svg className="w-4 h-4 transition-transform group-hover/download:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </button>
                    </div>

                    <div className="p-6 md:p-8 relative z-10">
                        {tenantData.recentTransactions && tenantData.recentTransactions.length > 0 ? (
                            <div className="space-y-3">
                                {tenantData.recentTransactions.map((tx: any, i) => (
                                    <div key={i} className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/30 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-blue-900/30 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-[0_5px_20px_rgba(34,211,238,0.1)] cursor-default">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                                                tx.type === 'payment' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white' : 
                                                tx.type === 'charge' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white' : 
                                                'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-cyan-400 group-hover:bg-blue-500 group-hover:text-white'
                                            }`}>
                                                {tx.type === 'payment' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>}
                                                {tx.type === 'charge' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                                                {tx.type === 'deposit' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
                                            </div>
                                            <div>
                                                <p className="text-sm md:text-base font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{tx.description}</p>
                                                <p className="text-xs font-bold text-slate-500 dark:text-blue-200/50 mt-1">{tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-base md:text-lg font-black tracking-tight ${tx.type === 'payment' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                {tx.type === 'payment' ? '-' : ''}₱{tx.amount.toLocaleString()}
                                            </p>
                                            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                                                tx.status === 'Paid' ? 'text-emerald-500' : 
                                                tx.status === 'Pending' ? 'text-rose-500' : 'text-cyan-500'
                                            }`}>{tx.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center text-slate-300 dark:text-blue-900/80 mb-6 border border-slate-100 dark:border-blue-900/30">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">No Transactions Yet</h3>
                                <p className="text-sm text-slate-500 dark:text-blue-200/60 mt-2 max-w-sm font-medium leading-relaxed">When you make a payment or receive an invoice, it will securely appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}