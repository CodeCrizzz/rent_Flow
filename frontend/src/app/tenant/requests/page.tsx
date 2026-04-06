"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Request {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
    admin_notes: string | null;
}

import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

interface Request {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
    admin_notes: string | null;
}

export default function TenantRequests() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Plumbing');
    const [priority, setPriority] = useState('Medium');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mouse Tracking Logic
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    const fetchMyRequests = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get('/requests/my-requests');
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        try {
            setIsSubmitting(true);
            await api.post('/requests', {
                title,
                description,
                category,
                priority
            });
            
            setTitle('');
            setDescription('');
            setCategory('Plumbing');
            setPriority('Medium');
            
            await fetchMyRequests();
        } catch (error) {
            console.error("Failed to submit request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';
            case 'In Progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-cyan-400';
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-zinc-400';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-7xl mx-auto space-y-12 pb-20 relative px-4"
        >
            {/* Matrix Background Engine */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 opacity-0 lg:group-hover:opacity-100">
                <div className="absolute inset-0" style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(249, 115, 22, 0.08), transparent 100%)`
                }} />
            </div>

            <div className="absolute top-0 -left-20 w-160 h-160 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                <motion.div variants={itemVariants}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
                        Terminal: Maintenance Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Facility Support</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-3">Log hardware malfunctions or structural issues for rapid deployment.</p>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                
                {/* Left Column: Submission Form */}
                <motion.div variants={itemVariants} className="lg:col-span-5 xl:col-span-4">
                    <div className="bg-white dark:bg-[#0a0f1c]/90 p-8 rounded-[2.5rem] border border-slate-200 dark:border-orange-900/30 shadow-xl backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="mb-10 relative z-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Post Request</h2>
                            <p className="text-[10px] text-slate-400 dark:text-orange-200/50 font-black uppercase tracking-[0.2em] mt-2">Matrix Submission Protocol</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">Objective</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. HVAC Unit Noise"
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-blue-900/30 rounded-2xl outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 font-bold text-slate-900 dark:text-white transition-all shadow-sm"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">Sector</label>
                                    <select 
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-blue-900/30 rounded-2xl outline-none focus:border-orange-500 appearance-none font-bold text-slate-800 dark:text-white cursor-pointer"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">Threat Level</label>
                                    <select 
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-blue-900/30 rounded-2xl outline-none focus:border-orange-500 appearance-none font-bold text-slate-800 dark:text-white cursor-pointer"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    >
                                        <option value="Urgent">Urgent</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest ml-1">Trace Details</label>
                                <textarea 
                                    required
                                    rows={4}
                                    placeholder="Describe the anomaly..."
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-blue-900/30 rounded-2xl outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 font-medium text-slate-900 dark:text-white transition-all shadow-sm resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="relative overflow-hidden w-full py-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4 uppercase text-xs tracking-widest shadow-xl shadow-orange-500/10"
                            >
                                <span className="relative z-10">{isSubmitting ? 'Syncing...' : 'Broadcast Request'}</span>
                                {!isSubmitting && <span className="absolute inset-0 bg-linear-to-r from-transparent via-orange-500/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]"></span>}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Right Column: Request History */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Logs</h2>
                        <div className="flex gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-orange-500 opacity-30"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-30"></div>
                        </div>
                    </div>
                    
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-24 text-center bg-white dark:bg-[#0a0f1c]/80 rounded-[2.5rem] border border-slate-200 dark:border-blue-900/30">
                                <div className="inline-block w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                                <p className="mt-6 font-black text-slate-400 dark:text-zinc-500 text-[10px] uppercase tracking-[0.3em] animate-pulse">Establishing Trace Link...</p>
                            </motion.div>
                        ) : requests.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-24 text-center bg-white dark:bg-[#0a0f1c]/80 rounded-[2.5rem] border border-slate-200 dark:border-blue-900/30 flex flex-col items-center">
                                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] flex items-center justify-center mb-8 border border-slate-100 dark:border-blue-900/30 shadow-inner">
                                    <span className="text-4xl grayscale opacity-30">🛠️</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Clear Channel</h3>
                                <p className="text-slate-500 dark:text-zinc-500 font-medium text-sm mt-4 max-w-xs leading-relaxed">No anomalies detected in your sector. All systems are operating within nominal parameters.</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {requests.map((req, idx) => (
                                    <motion.div 
                                        key={req.id} 
                                        variants={itemVariants}
                                        layout
                                        className="bg-white dark:bg-[#0a0f1c]/90 p-8 rounded-[2.5rem] border border-slate-200 dark:border-blue-900/30 shadow-xl hover:border-orange-500/30 transition-all duration-500 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8 border-b border-slate-100 dark:border-blue-900/30 pb-8 relative z-10">
                                            <div className="flex gap-4 items-center">
                                                <span className="text-[10px] font-black text-slate-500 dark:text-orange-400/60 bg-slate-50 dark:bg-orange-500/5 py-2 px-4 rounded-xl border border-slate-100 dark:border-orange-500/10 uppercase tracking-widest shadow-inner">#{req.id.toString().padStart(4, '0')}</span>
                                                <span className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all duration-500 shadow-sm ${getStatusBadge(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            <div className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {new Date(req.created_at).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col xl:flex-row gap-10 relative z-10">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight mb-4">{req.title}</h3>
                                                <div className="flex items-center gap-3 mb-8">
                                                    <span className="text-[9px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5">{req.category}</span>
                                                    <span className="text-[9px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5">{req.priority} Priority</span>
                                                </div>
                                                <div className="bg-slate-50/50 dark:bg-[#0d0d0d]/40 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-blue-900/20 shadow-inner group-hover:bg-white dark:group-hover:bg-[#0a0f1c] transition-colors duration-500">
                                                    <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-medium italic">
                                                        "{req.description}"
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="w-full xl:w-80 shrink-0">
                                                <div className="h-full bg-linear-to-br from-orange-500/[0.03] to-indigo-500/[0.03] dark:from-orange-500/5 dark:to-indigo-500/5 p-8 rounded-[2rem] border border-orange-100/50 dark:border-orange-500/10 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                                                    <div className="relative z-10">
                                                        <h4 className="text-[9px] font-black text-orange-800 dark:text-orange-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                                                            Admin Feed
                                                        </h4>
                                                        <p className="text-sm text-slate-600 dark:text-zinc-300 font-medium leading-relaxed">
                                                            {req.admin_notes ? req.admin_notes : 
                                                                req.status === 'Resolved' ? "Protocol complete. Satisfaction verification required." :
                                                                req.status === 'In Progress' ? "Technical cluster assigned. On-site verification pending." :
                                                                "Awaiting administrative triage. Anticipated response within 24h."
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}