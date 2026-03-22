"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function TenantProfile() {
    const [profile, setProfile] = useState({ name: '', email: '', phone: '', emergency_contact: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/tenant/profile');
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    emergency_contact: data.emergency_contact || ''
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (isLoading) return <div className="p-8 font-bold text-slate-500 animate-pulse">Loading profile...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input type="text" value={profile.name} disabled className="w-full bg-slate-50 border border-slate-200 text-slate-500 px-4 py-3 rounded-xl text-sm font-medium cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input type="email" value={profile.email} disabled className="w-full bg-slate-50 border border-slate-200 text-slate-500 px-4 py-3 rounded-xl text-sm font-medium cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <input type="text" defaultValue={profile.phone} className="w-full bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Emergency Contact</label>
                            <input type="text" defaultValue={profile.emergency_contact} className="w-full bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium" />
                        </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}