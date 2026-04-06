"use client";
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function TenantPayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
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
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.05), transparent 100%)`
                }} />
            </div>

            <div className="absolute top-0 -left-20 w-160 h-160 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                <motion.div variants={itemVariants}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        Ledger Synchronized
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Payment Archive</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-3">Verified transaction logs and cryptographically secured receipts.</p>
                </motion.div>
            </header>

            <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-[#0a0f1c]/90 rounded-4xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-blue-900/30 overflow-hidden backdrop-blur-xl relative group"
            >
                {/* Spotlight interaction overlay */}
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="overflow-x-auto custom-scrollbar relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-black/20 border-b border-slate-100 dark:border-blue-900/30">
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em]">Matrix Date</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em]">Transaction Trace</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em]">Delta</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-blue-900/20">
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <td colSpan={4} className="px-8 py-32 text-center">
                                            <div className="inline-block w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                                            <p className="font-black text-slate-400 dark:text-zinc-600 text-[10px] uppercase tracking-[0.4em] animate-pulse">Establishing Secure Stream...</p>
                                        </td>
                                    </motion.tr>
                                ) : payments.length === 0 ? (
                                    <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <td colSpan={4} className="px-8 py-32 text-center">
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-900/50 rounded-4xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-blue-900/30 shadow-inner">
                                                <span className="text-4xl grayscale opacity-30">📭</span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Clear Channel</h3>
                                            <p className="font-black text-slate-400 dark:text-zinc-500 text-[10px] uppercase tracking-[0.2em]">No matching traces found in regional ledger.</p>
                                        </td>
                                    </motion.tr>
                                ) : (
                                    payments.map((p, idx) => (
                                        <motion.tr 
                                            key={p.id} 
                                            variants={itemVariants}
                                            whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                                            className="transition-colors group cursor-default"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-slate-50 dark:bg-black/20 items-center justify-center border border-slate-100 dark:border-blue-900/30 group-hover:scale-110 transition-transform">
                                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path></svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{new Date(p.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                        <p className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mt-1">Stardate Sync</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-slate-700 dark:text-zinc-300 text-sm font-bold truncate max-w-[200px]">{p.description}</p>
                                                <p className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mt-1 italic">Hash: {p.id.toString().padStart(8, '0')}x7A</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-baseline gap-1">
                                                    <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">₱{Number(p.amount).toLocaleString()}</p>
                                                    <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700">PHP</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className={`inline-flex items-center gap-2.5 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border transition-all duration-500 shadow-sm ${
                                                    p.status === 'paid' 
                                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:bg-emerald-500/20' 
                                                    : 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:bg-amber-500/20'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129)]' : 'bg-amber-500 shadow-[0_0_8px_rgb(245,158,11)]'} animate-pulse`}></span>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}