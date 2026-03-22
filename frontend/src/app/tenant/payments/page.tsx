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
        <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Payments</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-bold animate-pulse">Loading...</td></tr>
                        ) : payments.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-bold">No payment history.</td></tr>
                        ) : (
                            payments.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-semibold text-sm">{new Date(p.due_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{p.description}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">₱ {Number(p.amount).toLocaleString()}</td>
                                    <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status.toUpperCase()}</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}