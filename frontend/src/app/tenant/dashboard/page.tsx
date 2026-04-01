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
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-slate-500 font-medium mt-1">Hello, {userName.split(' ')[0]}! Real-time overview of your stay.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Card 1*/}
                <div className="bg-white p-8 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)] transition-all duration-300 flex flex-col justify-between group md:col-span-2 lg:col-span-1 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm border border-emerald-100 group-hover:border-transparent group-hover:shadow-emerald-500/30">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">Due</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 mb-1">Current Balance</h3>
                        <p className="text-5xl font-black text-slate-900 tracking-tight mb-4 transition-all duration-700">₱ {Number(tenantData.balanceDue).toLocaleString()}</p>
                        
                        {payStatus ? (
                            <div className="w-full py-3 bg-emerald-500 text-white text-center font-bold rounded-xl animate-in zoom-in-95 duration-300 uppercase text-[10px] tracking-widest">
                                {payStatus}
                            </div>
                        ) : (
                            <button 
                                onClick={handlePayment}
                                disabled={isPaying || tenantData.balanceDue === 0}
                                className={`w-full px-4 py-3 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                                    isPaying ? 'bg-slate-100 text-slate-400 cursor-wait' : 
                                    tenantData.balanceDue === 0 ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100' :
                                    'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
                                }`}
                            >
                                {isPaying && <div className="w-4 h-4 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>}
                                {isPaying ? 'Processing...' : tenantData.balanceDue === 0 ? 'Fully Paid' : 'Pay Now'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(139,92,246,0.08)] transition-all duration-300 flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm border border-violet-100 group-hover:border-transparent group-hover:shadow-violet-500/30">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">Status</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 mb-1">Accommodation</h3>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">Pending</p>
                        <p className="text-sm text-slate-400 mt-2 font-medium">The admin will assign your room shortly.</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(6,182,212,0.08)] transition-all duration-300 flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm border border-cyan-100 group-hover:border-transparent group-hover:shadow-cyan-500/30">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">Inbox</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 mb-1">Recent Messages</h3>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">All Clear</p>
                        <Link href="/tenant/chat" className="inline-block mt-4 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors">
                            Contact Admin →
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}