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

    if (isLoading) return <div className="p-10 font-black text-slate-400 dark:text-zinc-600 animate-pulse text-xs uppercase tracking-[.2em]">Loading profile...</div>;
 
    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-10 relative animate-in fade-in slide-in-from-bottom-4 transition-colors duration-500">
            <div className="absolute top-0 left-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">My Profile</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2 transition-colors duration-500">Manage your residency credentials and security.</p>
                </div>
            </div>
 
            {status && (
                <div className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2 overflow-hidden relative shadow-lg ${status.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
                    <div className={`w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]`}></div>
                    {status.message}
                </div>
            )}
 
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-xl dark:shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden group transition-colors duration-500">
                <div className="h-40 bg-indigo-600 relative overflow-hidden transition-colors duration-500">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-indigo-950 flex items-center px-12">
                        <div className="w-24 h-24 bg-white dark:bg-[#0a0a0a] rounded-4xl flex items-center justify-center shadow-2xl translate-y-10 border border-indigo-100 dark:border-zinc-800 transition-colors duration-500">
                            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{profile.name.charAt(0) || '?'}</span>
                        </div>
                    </div>
                </div>
 
                <div className="p-12 pt-20 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest pl-1">Full Legal Name</label>
                            <input type="text" value={profile.name} disabled className="w-full bg-slate-50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800 text-slate-400 dark:text-zinc-600 px-6 py-4.5 rounded-2xl text-sm font-bold cursor-not-allowed transition-colors duration-500 shadow-sm" />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest pl-1">Primary Email Address</label>
                            <input type="email" value={profile.email} disabled className="w-full bg-slate-50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800 text-slate-400 dark:text-zinc-600 px-6 py-4.5 rounded-2xl text-sm font-bold cursor-not-allowed transition-colors duration-500 shadow-sm" />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest pl-1">Mobile number</label>
                            <input 
                                type="text" 
                                value={profile.phone} 
                                onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                                className="w-full bg-white dark:bg-[#080808]/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-6 py-4.5 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600" 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest pl-1">Emergency Contact Number</label>
                            <input 
                                type="text" 
                                value={profile.emergency_contact} 
                                onChange={(e) => setProfile({...profile, emergency_contact: e.target.value})} 
                                className="w-full bg-white dark:bg-[#080808]/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-6 py-4.5 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600" 
                            />
                        </div>
                    </div>
                    
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-slate-100 dark:border-zinc-900 transition-colors duration-500">
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-zinc-900/30 px-6 py-4 rounded-2xl border border-slate-100 dark:border-zinc-800 max-w-md transition-colors duration-500">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-bold leading-relaxed transition-colors duration-500">To update your legal name or primary email, please contact the property administrator.</p>
                        </div>
                        <button 
                            onClick={handleUpdate} 
                            disabled={isUpdating} 
                            className={`px-12 py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 w-full sm:w-auto flex items-center justify-center gap-3 active:scale-95 ${isUpdating ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isUpdating && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                            {isUpdating ? 'Synchronizing...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}