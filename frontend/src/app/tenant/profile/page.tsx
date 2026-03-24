"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function TenantProfile() {
    const [profile, setProfile] = useState({ name: '', email: '', phone: '', emergency_contact: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState<any>(null);

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

    const handleUpdate = async () => {
        setIsUpdating(true);
        setStatus(null);
        try {
            await api.put('/tenant/profile', {
                phone: profile.phone,
                emergency_contact: profile.emergency_contact
            });
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            console.error("Update failed:", error);
            setStatus({ type: 'error', message: 'Failed to update profile.' });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div className="p-8 font-bold text-slate-500 animate-pulse">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Profile</h1>
                <p className="text-slate-500 font-medium mt-2">Manage your residency credentials and security.</p>
            </div>

            {status && (
                <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 overflow-hidden relative ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${status.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                    {status.message}
                </div>
            )}

            <div className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden group">
                <div className="h-32 bg-indigo-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center px-10">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl translate-y-10">
                            <span className="text-3xl font-black text-indigo-600">{profile.name.charAt(0) || '?'}</span>
                        </div>
                    </div>
                </div>

                <div className="p-10 pt-16 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Legal Name</label>
                            <input type="text" value={profile.name} disabled className="w-full bg-slate-50/50 border border-slate-100 text-slate-400 px-5 py-3.5 rounded-2xl text-sm font-bold cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Email</label>
                            <input type="email" value={profile.email} disabled className="w-full bg-slate-50/50 border border-slate-100 text-slate-400 px-5 py-3.5 rounded-2xl text-sm font-bold cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mobile number</label>
                            <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-900 px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Emergency Contact</label>
                            <input type="text" value={profile.emergency_contact} onChange={(e) => setProfile({...profile, emergency_contact: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-900 px-5 py-3.5 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none transition-all" />
                        </div>
                    </div>
                    
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">To update your legal name or email, please contact the property administrator.</p>
                        <button onClick={handleUpdate} disabled={isUpdating} className={`px-10 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto flex items-center justify-center gap-2 ${isUpdating ? 'opacity-70 cursor-wait' : ''}`}>
                            {isUpdating && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                            {isUpdating ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}