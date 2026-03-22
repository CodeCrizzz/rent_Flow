"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Tenant {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    room_number: string | null;
    created_at: string;
}

export default function AdminTenants() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const { data } = await api.get('/admin/tenants');
                setTenants(data);
            } catch (error) {
                console.error("Failed to fetch tenants:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTenants();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenants Directory</h1>
                    <p className="text-slate-500 font-medium mt-1">Live from PostgreSQL database.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-bold animate-pulse">Loading tenants...</td>
                                </tr>
                            ) : tenants.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-bold">No tenants registered yet.</td>
                                </tr>
                            ) : (
                                tenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{tenant.name}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm font-medium">{tenant.email}</td>
                                        <td className="px-6 py-4 font-bold text-slate-700">
                                            {tenant.room_number ? (
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Rm {tenant.room_number}</span>
                                            ) : (
                                                <span className="text-slate-400 text-sm italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 font-bold text-sm hover:underline">Manage</button>
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