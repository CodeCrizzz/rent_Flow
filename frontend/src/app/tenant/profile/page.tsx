"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- EXPANDED DATA STRUCTURE ---
interface ProfileData {
    name: string;
    email: string;
    phone: string;
    gender: string;
    address: string;
    occupation: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    profile_picture: string | null;
    account: {
        username: string;
        status: string;
        registered_at: string;
    };
    room: {
        number: string;
        type: string;
        move_in: string;
        rent: number;
        contract_end: string;
    } | null;
    // New Sections
    payment?: {
        balance: number;
        status: string;
        last_payment: string;
    };
    maintenance?: {
        total: number;
        pending: number;
        recent_status: string;
    };
}

export default function TenantProfile() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    
    // Form States
    const [editForm, setEditForm] = useState({ 
        name: '', phone: '', email: '', address: '', gender: '', 
        occupation: '', emergency_contact_name: '', emergency_contact_phone: '',
        password_confirm: '' 
    });
    const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
    
    // UI States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [passError, setPassError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/tenant/profile');
                
                // Injecting default mock data for the new sections
                const enrichedData = {
                    ...data,
                    payment: data.payment || { balance: 1500, status: 'Partial', last_payment: '2026-03-28' },
                    maintenance: data.maintenance || { total: 3, pending: 1, recent_status: 'In Progress' }
                };
                
                setProfile(enrichedData);
                setEditForm({ 
                    name: data.name || '', 
                    phone: data.phone || '', 
                    email: data.email || '',
                    address: data.address || '',
                    gender: data.gender || 'Male',
                    occupation: data.occupation || '',
                    emergency_contact_name: data.emergency_contact_name || '',
                    emergency_contact_phone: data.emergency_contact_phone || '',
                    password_confirm: ''
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // --- FORM VALIDATION ---
    const validateEditForm = () => {
        if (!editForm.name || !editForm.phone || !editForm.email) return "Basic fields (*) are required.";
        if (!/\S+@\S+\.\S+/.test(editForm.email)) return "Enter a valid email address.";
        if (editForm.phone.length < 10) return "Phone number must be at least 10 digits.";
        if (!editForm.password_confirm) return "Confirm your password to authorize changes.";
        return null;
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateEditForm();
        if (error) return setFormError(error);

        setFormError(null);
        setIsSubmitting(true);
        try {
            await api.put('/tenant/profile', editForm);
            setProfile(prev => prev ? { ...prev, ...editForm } : null);
            setIsEditModalOpen(false);
        } catch (err: any) {
            setFormError(err.response?.data?.message || "Verification failed. Check your password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passForm.new !== passForm.confirm) return setPassError("New passwords do not match.");
        if (passForm.new.length < 6) return setPassError("Password must be at least 6 characters.");
        
        setPassError(null);
        setIsSubmitting(true);
        try {
            await api.put('/tenant/profile/password', passForm);
            setIsPassModalOpen(false);
            setPassForm({ current: '', new: '', confirm: '' });
        } catch (err: any) {
            setPassError(err.response?.data?.message || "Failed to update password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
    };

    if (isLoading) return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 dark:bg-[#020617]"><div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>;
    if (!profile) return null;

    return (
        /* --- FIXED VIEWPORT BREAKOUT --- */
        /* This eliminates the layout borders and completely takes over the screen */
        <div className="fixed inset-0 md:pl-[280px] z-[50] overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-500">
            
            {/* Custom Animations & Texture */}
            <style>{`
                .glass-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.04;
                    mix-blend-mode: overlay;
                    pointer-events: none;
                }
            `}</style>

            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen"></div>
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen"></div>

            {/* --- PERFECT CENTERING WRAPPER --- */}
            <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
                
                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-5xl space-y-6 relative z-10 py-10">

                    {/* --- HEADER NAVIGATION --- */}
                    <motion.div variants={itemVariants} className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black tracking-tight">Identity Hub</h2>
                        <button onClick={() => window.history.back()} className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-blue-500 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4 transition-transform hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                            Return
                        </button>
                    </motion.div>

                    {/* --- 1. PROFILE OVERVIEW & ACTIONS --- */}
                    <motion.div 
                        variants={itemVariants} 
                        whileHover={{ scale: 1.01, translateY: -4 }}
                        className="relative bg-white/60 dark:bg-[#0a0a0a]/60 border border-white/40 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-xl hover:shadow-2xl hover:border-blue-500/30 dark:hover:border-blue-500/30 backdrop-blur-2xl overflow-hidden transition-all duration-500 group/card"
                    >
                        <div className="absolute inset-0 glass-noise"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                            
                            {/* Profile Picture */}
                            <div className="relative shrink-0">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white text-5xl font-black shadow-lg overflow-hidden group-hover/card:scale-105 transition-transform duration-500">
                                    {profile.profile_picture ? <img src={profile.profile_picture} className="w-full h-full object-cover" alt="Profile" /> : profile.name.charAt(0)}
                                </div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 border-[3px] border-white dark:border-[#0a0a0a] rounded-full flex items-center justify-center shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </div>

                            {/* Personal Details */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">{profile.name}</h1>
                                    <p className="text-xs font-bold text-neutral-500 flex items-center justify-center md:justify-start gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        {profile.email}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                                    <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Contact</span><span className="text-sm font-bold">{profile.phone || 'N/A'}</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Gender</span><span className="text-sm font-bold">{profile.gender || 'Not Set'}</span></div>
                                    <div className="flex flex-col col-span-2 md:col-span-1"><span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Address</span><span className="text-sm font-bold truncate" title={profile.address}>{profile.address || 'Not Provided'}</span></div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                                <button onClick={() => setIsEditModalOpen(true)} className="flex-1 md:flex-none px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex justify-center items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    Edit Profile
                                </button>
                                <button onClick={() => setIsPassModalOpen(true)} className="flex-1 md:flex-none px-6 py-3.5 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest flex justify-center items-center gap-2 backdrop-blur-md">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    Password
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- BENTO INFORMATION GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* ROOM INFORMATION */}
                        <motion.div 
                            variants={itemVariants} 
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            className="relative bg-white/60 dark:bg-[#0a0a0a]/60 border border-white/40 dark:border-white/10 rounded-[2rem] p-8 flex flex-col overflow-hidden backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 group/bento"
                        >
                            <div className="absolute inset-0 glass-noise"></div>
                            <div className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">Admin Only</div>
                            <h3 className="relative z-10 text-xs font-black text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2 group-hover/bento:text-blue-500 transition-colors">
                                <span className="text-xl group-hover/bento:scale-125 transition-transform duration-500">🚪</span> Room Info
                            </h3>
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Room</span><span className="text-sm font-black text-blue-600 dark:text-cyan-400">{profile.room?.number || 'TBD'}</span></div>
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Type</span><span className="text-xs font-bold">{profile.room?.type || 'N/A'}</span></div>
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Rent</span><span className="text-sm font-black">₱{profile.room?.rent?.toLocaleString() || '0'}</span></div>
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Move-in</span><span className="text-xs font-bold">{profile.room?.move_in ? new Date(profile.room.move_in).toLocaleDateString() : 'N/A'}</span></div>
                                <div className="flex justify-between items-center pt-1"><span className="text-xs font-bold text-neutral-500">Contract End</span><span className="text-xs font-black text-rose-500">{profile.room?.contract_end || 'N/A'}</span></div>
                            </div>
                        </motion.div>

                        {/* ACCOUNT INFORMATION */}
                        <motion.div 
                            variants={itemVariants} 
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            className="relative bg-white/60 dark:bg-[#0a0a0a]/60 border border-white/40 dark:border-white/10 rounded-[2rem] p-8 flex flex-col overflow-hidden backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group/bento"
                        >
                            <div className="absolute inset-0 glass-noise"></div>
                            <h3 className="relative z-10 text-xs font-black text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2 group-hover/bento:text-emerald-500 transition-colors">
                                <span className="text-xl group-hover/bento:scale-125 transition-transform duration-500">👤</span> Account Info
                            </h3>
                            <div className="relative z-10 space-y-4 flex-1">
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Username</span><span className="text-xs font-bold truncate max-w-[150px]">{profile.account?.username || profile.email}</span></div>
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Status</span><span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider ${profile.account?.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>{profile.account?.status || 'Pending'}</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs font-bold text-neutral-500">Registered</span><span className="text-xs font-bold">{profile.account?.registered_at ? new Date(profile.account.registered_at).toLocaleDateString() : 'N/A'}</span></div>
                            </div>
                        </motion.div>

                        {/* PAYMENT SUMMARY */}
                        <motion.div 
                            variants={itemVariants} 
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            className="relative bg-white/60 dark:bg-[#0a0a0a]/60 border border-white/40 dark:border-white/10 rounded-[2rem] p-8 flex flex-col overflow-hidden backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:border-rose-500/30 transition-all duration-500 group/bento"
                        >
                            <div className="absolute inset-0 glass-noise"></div>
                            <h3 className="relative z-10 text-xs font-black text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2 group-hover/bento:text-rose-500 transition-colors">
                                <span className="text-xl group-hover/bento:scale-125 transition-transform duration-500">💳</span> Payment Summary
                            </h3>
                            <div className="relative z-10 space-y-4 flex-1">
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Current Balance</span><span className="text-lg font-black text-rose-500 dark:text-rose-400">₱{profile.payment?.balance?.toLocaleString() || '0'}</span></div>
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Status</span><span className={`text-xs font-black uppercase ${profile.payment?.status === 'Paid' ? 'text-emerald-500' : profile.payment?.status === 'Partial' ? 'text-amber-500' : 'text-rose-500'}`}>{profile.payment?.status || 'Up to date'}</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs font-bold text-neutral-500">Last Payment</span><span className="text-xs font-bold">{profile.payment?.last_payment ? new Date(profile.payment.last_payment).toLocaleDateString() : 'N/A'}</span></div>
                            </div>
                        </motion.div>

                        {/* MAINTENANCE SUMMARY */}
                        <motion.div 
                            variants={itemVariants} 
                            whileHover={{ scale: 1.02, translateY: -5 }}
                            className="relative bg-white/60 dark:bg-[#0a0a0a]/60 border border-white/40 dark:border-white/10 rounded-[2rem] p-8 flex flex-col overflow-hidden backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:border-amber-500/30 transition-all duration-500 group/bento"
                        >
                            <div className="absolute inset-0 glass-noise"></div>
                            <h3 className="relative z-10 text-xs font-black text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2 group-hover/bento:text-amber-500 transition-colors">
                                <span className="text-xl group-hover/bento:scale-125 transition-transform duration-500">🛠️</span> Maintenance
                            </h3>
                            <div className="relative z-10 space-y-4 flex-1">
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Total Requests</span><span className="text-sm font-black">{profile.maintenance?.total || '0'}</span></div>
                                <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5"><span className="text-xs font-bold text-neutral-500">Pending</span><span className="text-sm font-black text-amber-500">{profile.maintenance?.pending || '0'}</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs font-bold text-neutral-500">Recent Status</span><span className="text-xs font-bold uppercase tracking-wide text-blue-500">{profile.maintenance?.recent_status || 'None'}</span></div>
                            </div>
                        </motion.div>

                    </div>
                </motion.div>
            </div>

            {/* --- MODALS --- */}
            {/* EDIT PROFILE MODAL */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#020617]/60 backdrop-blur-xl z-[100]" onClick={() => setIsEditModalOpen(false)} />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col">
                                <div className="absolute inset-0 glass-noise pointer-events-none"></div>
                                <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-transparent z-10 shrink-0">
                                    <div><h2 className="text-xl font-black tracking-tight">Edit Profile</h2></div>
                                    <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                </div>
                                <form onSubmit={handleUpdateProfile} className="p-6 space-y-6 relative z-10 overflow-y-auto overflow-x-hidden">
                                    {formError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-xl text-center">{formError}</div>}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Full Name</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm" /></div>
                                        <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Email Address</label><input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm" /></div>
                                        <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Contact Number</label><input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm" /></div>
                                        <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Gender</label><select value={editForm.gender} onChange={(e) => setEditForm({...editForm, gender: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm appearance-none"><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                                    </div>
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Home Address</label><textarea value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none backdrop-blur-sm" rows={2} /></div>
                                    
                                    <div className="pt-4 border-t border-black/5 dark:border-white/5">
                                        <div className="space-y-1 mb-4"><label className="text-[10px] font-bold text-rose-500 uppercase tracking-widest ml-1 flex items-center gap-2">Confirm Password to Save</label><input type="password" value={editForm.password_confirm} onChange={(e) => setEditForm({...editForm, password_confirm: e.target.value})} className="w-full bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500 backdrop-blur-sm" placeholder="Required" /></div>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 w-full md:w-auto backdrop-blur-sm border border-transparent dark:border-white/5">Cancel</button>
                                            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}

                {/* PASSWORD MODAL */}
                {isPassModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#020617]/60 backdrop-blur-xl z-[100]" onClick={() => setIsPassModalOpen(false)} />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden pointer-events-auto">
                                <div className="absolute inset-0 glass-noise"></div>
                                <div className="relative z-10 p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center"><h2 className="text-xl font-black tracking-tight">Change Password</h2><button onClick={() => setIsPassModalOpen(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
                                <form onSubmit={handlePasswordChange} className="relative z-10 p-6 space-y-4">
                                    {passError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-xl text-center">{passError}</div>}
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Current Password</label><input type="password" value={passForm.current} onChange={(e) => setPassForm({...passForm, current: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm" /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">New Password</label><input type="password" value={passForm.new} onChange={(e) => setPassForm({...passForm, new: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm" /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Confirm Password</label><input type="password" value={passForm.confirm} onChange={(e) => setPassForm({...passForm, confirm: e.target.value})} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm" /></div>
                                    <button disabled={isSubmitting} className="w-full mt-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-cyan-400 transition-all shadow-md">{isSubmitting ? 'Updating...' : 'Update Password'}</button>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}