"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function TenantPayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const { data } = await api.get('/tenant/payments');
                setPayments(data);
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPayments();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-10 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute top-0 left-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Payment History</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2 transition-colors duration-500">View your transaction history and upcoming dues.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-xl dark:shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden transition-colors duration-500">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 transition-colors duration-500">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Billing Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Description</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50 transition-colors duration-500">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                                        <p className="mt-4 font-black text-slate-400 dark:text-zinc-500 text-xs uppercase tracking-widest">Fetching records...</p>
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-zinc-800">
                                            <span className="text-3xl">📭</span>
                                        </div>
                                        <p className="font-bold text-slate-400 dark:text-zinc-500 text-sm">No payment history found.</p>
                                    </td>
                                </tr>
                            ) : (
                                payments.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                                        <td className="px-8 py-7">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm transition-colors duration-500">{new Date(p.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </td>
                                        <td className="px-8 py-7">
                                            <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium transition-colors duration-500">{p.description}</p>
                                        </td>
                                        <td className="px-8 py-7">
                                            <p className="font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">₱{Number(p.amount).toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all duration-300 ${
                                                p.status === 'paid' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                                                : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}