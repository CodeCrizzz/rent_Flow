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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
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

    if (!isMounted) return null; 

    return (
        /* Completely transparent wrapper so it blends flawlessly with your layout */
        <div className="w-full text-neutral-900 dark:text-neutral-100 font-sans flex flex-col pb-20 transition-colors duration-300 bg-transparent">
            
            <div className="max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-6">
                
                {/* --- HEADER --- */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-none text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide mb-3">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                                </span>
                                Tenant Portal
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                Welcome back, {userName.split(' ')[0] || 'Resident'}
                            </h1>
                        </div>
                    </div>
                </header>

                {/* --- BENTO GRID LAYOUT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* HERO CARD: Billing & Balance */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#121212] rounded-3xl p-8 sm:p-10 border border-neutral-200 dark:border-none dark:shadow-none shadow-sm flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
                        {/* Softened the background glare */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Total Outstanding</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl sm:text-7xl font-bold tracking-tighter text-neutral-900 dark:text-white">
                                    ₱{displayBalance.toLocaleString()}
                                </span>
                                <span className="text-2xl sm:text-3xl font-medium text-neutral-400 dark:text-neutral-500">.00</span>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12 flex flex-col sm:flex-row gap-6 items-center justify-between border-t border-neutral-100 dark:border-white/5 pt-8">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 w-full sm:max-w-xs">
                                Your next billing cycle generates on the 1st of the month.
                            </p>
                            
                            {payStatus ? (
                                <div className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 text-white text-center font-semibold rounded-2xl animate-in zoom-in duration-300 flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    {payStatus}
                                </div>
                            ) : (
                                <button 
                                    onClick={handlePayment}
                                    disabled={isPaying || tenantData.balanceDue === 0}
                                    className={`w-full sm:w-auto px-8 py-3.5 font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 ${
                                        isPaying ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-wait' : 
                                        tenantData.balanceDue === 0 ? 'bg-neutral-50 dark:bg-neutral-800/50 text-neutral-400 cursor-not-allowed border border-neutral-200 dark:border-none' :
                                        'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                                >
                                    {isPaying && <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>}
                                    {isPaying ? 'Processing...' : tenantData.balanceDue === 0 ? 'Account Settled' : 'Make Payment'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* SIDE CARDS (Spans 4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        {/* Status Card */}
                        <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-neutral-200 dark:border-none dark:shadow-none shadow-sm flex-1 flex flex-col justify-center transition-colors duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Unit Status</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
                                    <p className="text-2xl font-bold">Pending</p>
                                </div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Awaiting room assignment.</p>
                            </div>
                        </div>

                        {/* Messages Card */}
                        <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-neutral-200 dark:border-none dark:shadow-none shadow-sm flex-1 flex flex-col justify-center hover:border-indigo-200 dark:hover:bg-[#181818] transition-all duration-300 cursor-pointer group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Messages</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold mb-1">0 Unread</p>
                                <Link href="/tenant/chat" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                                    Open Inbox <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TRANSACTIONS SECTION --- */}
                <div className="bg-white dark:bg-[#121212] rounded-3xl border border-neutral-200 dark:border-none dark:shadow-none shadow-sm overflow-hidden transition-colors duration-300">
                    <div className="p-6 sm:px-8 border-b border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold">Recent Transactions</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Your billing history for the last 30 days.</p>
                        </div>
                        <button className="self-start sm:self-auto px-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl transition-colors border border-neutral-200 dark:border-none text-sm font-medium flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download Statement
                        </button>
                    </div>

                    <div className="p-2 sm:p-4">
                        {tenantData.recentTransactions && tenantData.recentTransactions.length > 0 ? (
                            <div className="space-y-1">
                                {tenantData.recentTransactions.map((tx: any, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                tx.type === 'payment' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                                                tx.type === 'charge' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 
                                                'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                            }`}>
                                                {tx.type === 'payment' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                                                {tx.type === 'charge' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                                                {tx.type === 'deposit' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{tx.description}</p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">{tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${tx.type === 'payment' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                                                {tx.type === 'payment' ? '-' : ''}₱{tx.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs font-medium text-neutral-500 mt-0.5">{tx.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">No Transactions Yet</h3>
                                <p className="text-sm text-neutral-500 mt-1 max-w-xs">Payments and invoices will appear here once they are processed.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}