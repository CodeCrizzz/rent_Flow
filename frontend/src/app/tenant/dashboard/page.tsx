"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function TenantDashboard() {
    const [tenantData, setTenantData] = useState({ balanceDue: 0, recentTransactions: [] });
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get user name from local storage
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

    if (isLoading) return <div className="p-8 font-bold text-slate-500 animate-pulse">Loading your dashboard...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hello, {userName.split(' ')[0]}!</h1>
                <p className="text-slate-500 font-medium mt-1">Here is your live account overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Live Balance Card */}
                <div className="md:col-span-2 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <h3 className="text-blue-200 font-bold uppercase tracking-wider text-sm mb-2">Current Balance Due</h3>
                    <p className="text-5xl font-black mb-8">₱ {Number(tenantData.balanceDue).toLocaleString()}</p>
                    
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-slate-50">
                            Pay Now
                        </button>
                    </div>
                </div>

                {/* Live Room Info Card (Placeholder until we build room assignment API) */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col justify-center">
                    <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Your Accommodation</h3>
                    <p className="text-2xl font-black text-slate-900 mb-4">Pending Assignment</p>
                    <p className="text-sm text-slate-500">The admin will assign your room shortly.</p>
                </div>
            </div>
        </div>
    );
}