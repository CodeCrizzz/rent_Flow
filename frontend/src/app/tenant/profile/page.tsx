"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

export default function TenantProfile() {
    const [profile, setProfile] = useState({ name: '', email: '', phone: '', emergency_contact: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

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
            setStatus({ type: 'success', message: 'Credentials Synchronized' });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            console.error("Update failed:", error);
            setStatus({ type: 'error', message: 'Sync Interrupted' });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#050505]">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
            <div className="font-black text-indigo-500 animate-pulse uppercase tracking-[0.4em] text-[10px]">Accessing Identity Node...</div>
        </div>
    );
 
    return (
        <motion.div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto space-y-12 pb-20 relative px-4"
        >
            {/* Matrix Background Engine */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 opacity-0 group-hover:opacity-100 lg:block hidden">
                <div className="absolute inset-0" style={{
                    background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(79, 70, 229, 0.05), transparent 100%)`
                }} />
            </div>

            <div className="absolute top-0 -right-20 w-160 h-160 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
                        Status: Identity Verified
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Identity Hub</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-3">Personnel credentials and tactical contact frequency settings.</p>
                </motion.div>

                <AnimatePresence>
                    {status && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl backdrop-blur-xl border ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${status.type === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-bounce'}`}></div>
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
 
            <div className="bg-white dark:bg-[#0a0f1c]/90 rounded-4xl shadow-2xl border border-slate-200 dark:border-blue-900/30 overflow-hidden relative group backdrop-blur-2xl">
                {/* Visual Header */}
                <div className="h-52 bg-linear-to-br from-indigo-600 to-blue-700 relative overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-20"></div>
                    <div className="absolute top-0 right-0 w-120 h-120 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black/20 to-transparent"></div>
                    
                    <div className="absolute -bottom-12 left-12 flex items-end gap-8">
                        <div className="w-32 h-32 bg-white dark:bg-[#0a0f1c] rounded-4xl p-2 shadow-2xl relative group/avatar">
                            <div className="w-full h-full bg-linear-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white dark:border-[#0a0f1c] transition-transform duration-500 group-hover/avatar:scale-95">
                                <span className="text-5xl font-black text-white drop-shadow-lg">{profile.name.charAt(0) || '?'}</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white dark:border-[#0a0f1c] rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                        </div>
                        <div className="mb-14">
                            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">{profile.name}</h2>
                            <p className="text-[10px] font-black text-indigo-100/70 uppercase tracking-[0.3em] mt-1">Tenant ID: RF-{Math.floor(Math.random()*9000+1000)}</p>
                        </div>
                    </div>
                </div>
 
                <div className="p-12 pt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Personal Data */}
                        <div className="space-y-8">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                <h3 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em]">System Credentials</h3>
                             </div>

                             <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Legal Designation</label>
                                    <div className="w-full px-6 py-5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-blue-900/30 rounded-2xl text-sm font-bold text-slate-400 dark:text-zinc-600 cursor-not-allowed flex items-center justify-between">
                                        {profile.name}
                                        <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Primary Transmission Route</label>
                                    <div className="w-full px-6 py-5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-blue-900/30 rounded-2xl text-sm font-bold text-slate-400 dark:text-zinc-600 cursor-not-allowed flex items-center justify-between">
                                        {profile.email}
                                        <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Contact Data */}
                        <div className="space-y-8">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                <h3 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Communication Nodes</h3>
                             </div>

                             <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Active Mobile Frequency</label>
                                    <input 
                                        type="text" 
                                        value={profile.phone} 
                                        onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                                        placeholder="+1 (xxx) xxx-xxxx"
                                        className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-blue-900/30 text-slate-900 dark:text-white px-6 py-5 rounded-3xl text-sm font-bold focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-300 dark:placeholder:text-zinc-700" 
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Emergency Uplink</label>
                                    <input 
                                        type="text" 
                                        value={profile.emergency_contact} 
                                        onChange={(e) => setProfile({...profile, emergency_contact: e.target.value})} 
                                        placeholder="Emergency contact name/number"
                                        className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-blue-900/30 text-slate-900 dark:text-white px-6 py-5 rounded-3xl text-sm font-bold focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-300 dark:placeholder:text-zinc-700" 
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-16 flex flex-col xl:flex-row items-center justify-between gap-10 p-8 rounded-[2.5rem] bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10">
                        <div className="flex items-center gap-6 max-w-2xl">
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#0a0f1c] flex items-center justify-center shrink-0 shadow-lg border border-indigo-100/50 dark:border-indigo-500/20">
                                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">
                                Access Control: Core identity primitives (Legal Name, Primary Email) are managed at the central administrative node. Contact support to request a credential re-assignment protocol.
                            </p>
                        </div>
                        <button 
                            onClick={handleUpdate} 
                            disabled={isUpdating} 
                            className="relative overflow-hidden px-14 py-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/10 group/btn"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isUpdating ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
                                        Synchronizing Hub
                                    </>
                                ) : 'Update Credentials'}
                            </span>
                            {!isUpdating && <div className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}