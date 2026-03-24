"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Tenant {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    room_number: string | null;
}

export default function AdminTenants() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const { data } = await api.get('/admin/tenants');
                setTenants(data);
            } catch (err: any) {
                console.error("Failed to fetch tenants:", err);
                setError("Failed to load tenants.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenants();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tenants Directory</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage all active residents and pending applications.</p>
                </div>
                <div className="relative group">
                    <input type="text" placeholder="Search tenants..." className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 w-full sm:w-80 shadow-sm transition-all" />
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-sm flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                    {error}
                </div>
            )}

            <div className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident Information</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Unit</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center">
                                        <div className="inline-block w-6 h-6 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                                        <p className="mt-3 font-bold text-slate-400 text-xs">Fetching residents...</p>
                                    </td>
                                </tr>
                            ) : tenants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold text-sm">
                                        No residents found.
                                    </td>
                                </tr>
                            ) : (
                                tenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                    {tenant.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900">{tenant.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm">
                                                <p className="font-bold text-slate-700">{tenant.email}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{tenant.phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-900">{tenant.room_number ? `Room ${tenant.room_number}` : 'Unassigned'}</td>
                                        <td className="px-8 py-6">
                                            {tenant.room_number ? (
                                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100">Active</span>
                                            ) : (
                                                <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="px-4 py-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 rounded-lg transition-colors">View Profile</button>
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