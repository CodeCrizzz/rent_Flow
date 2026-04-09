"use client";
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';

// Helper to get st, nd, rd, th for dates
const getOrdinalSuffix = (i: number) => {
    const j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
};

// Safe date formatter to prevent "Invalid Date"
const formatDate = (dateString: string | null | undefined, options?: Intl.DateTimeFormatOptions) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString(undefined, options || { month: 'short', day: 'numeric', year: 'numeric' });
};

// Helper to calculate the next due date based on the account creation date
const calculateNextDueDate = (createdAtStr: string) => {
    if (!createdAtStr) return new Date().toISOString();
    const creationDate = new Date(createdAtStr);
    const dueDay = creationDate.getDate(); 
    
    const today = new Date();
    let nextDue = new Date(today.getFullYear(), today.getMonth(), dueDay);
    
    // If today is past the due day, the next due date is next month
    if (today.getDate() > dueDay) {
        nextDue.setMonth(nextDue.getMonth() + 1);
    }
    return nextDue.toISOString();
};

// Default empty state while fetching
const defaultBill = {
    month: "Loading...",
    dueDate: new Date().toISOString(),
    totalAmount: 0,
    amountPaid: 0,
    remainingBalance: 0,
    status: "Loading",
    breakdown: { rent: 0, water: 0, electricity: 0, other: 0 },
    creationDay: 1,
    createdAt: null
};

interface Bill {
    month: string;
    dueDate: string | null;
    totalAmount: number;
    amountPaid: number;
    remainingBalance: number;
    status: string;
    breakdown?: { rent: number, water: number, electricity: number, other: number };
    creationDay: number;
    createdAt?: string | null;
}

export default function TenantPayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [currentBill, setCurrentBill] = useState<Bill>(defaultBill);
    const [isLoading, setIsLoading] = useState(true);

    // Payment Modal State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [payAmount, setPayAmount] = useState("");
    const [payMethod, setPayMethod] = useState<'GCash' | 'Bank Transfer' | 'Cash'>('GCash');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Real Data from Database
    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const [billResponse, paymentsResponse] = await Promise.all([
                    api.get('/tenant/bill/current').catch(err => {
                        console.warn("Current Bill endpoint not found (404)");
                        return { data: defaultBill }; 
                    }),
                    // If this fails, return an empty array
                    api.get('/tenant/payments').catch(err => {
                        console.warn("Payments history endpoint not found (404)");
                        return { data: [] };
                    })
                ]);
                
                if (billResponse.data) {
                    setCurrentBill(billResponse.data);
                } else {
                    setCurrentBill(defaultBill);
                }
                setPayments(paymentsResponse.data);
            } catch (error) {
                console.error("Critical error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPaymentData();
    }, []);

    // Handle form submission to real backend
    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            formData.append('amount', payAmount);
            formData.append('method', payMethod);
            if (proofFile) {
                formData.append('proofOfPayment', proofFile);
            }

            const { data } = await api.post('/tenant/payments', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setPayments(prev => [data.newPayment, ...prev]);
            setCurrentBill(data.updatedBill);

            setProofFile(null);
            setIsPaymentModalOpen(false);
        } catch (error) {
            console.error("Payment submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProofFile(e.target.files[0]);
        }
    };

    // --- SMOOTH CUSTOM ANIMATIONS ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.12, 
                delayChildren: 0.1 
            } 
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, filter: "blur(15px)" },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: "blur(0px)", 
            transition: { 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1] 
            } 
        }
    };

    return (
        <div className="w-full text-neutral-900 dark:text-neutral-100 font-sans flex flex-col pb-20 bg-transparent relative min-h-screen">
            
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen"></div>
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen"></div>

            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto w-full space-y-8 pt-10 px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* --- HEADER --- */}
                <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide mb-4 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Billing & Invoices
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-indigo-800 to-neutral-900 dark:from-white dark:via-indigo-200 dark:to-white drop-shadow-sm pb-1">
                            Payment Center
                        </h1>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-2 max-w-lg leading-relaxed">
                            Manage your current balances, view detailed breakdowns, and securely submit payments.
                        </p>
                    </div>
                </motion.header>

                {/* --- BILL OVERVIEW & BREAKDOWN GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    <motion.div variants={itemVariants} className="lg:col-span-7 relative rounded-[2rem] bg-white/60 dark:bg-[#121212]/60 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 border border-white/40 dark:border-white/10 overflow-hidden flex flex-col p-8 sm:p-10">
                        <div className="absolute inset-0 glass-noise z-0"></div>
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

                        <div className="relative z-10 flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Current Bill</h3>
                                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                                    {currentBill.totalAmount === 0 && !isLoading ? "No Active Bill" : currentBill.month}
                                </p>
                            </div>
                            {!isLoading && currentBill.totalAmount > 0 && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-full border backdrop-blur-sm ${
                                    currentBill.status === 'Paid' || currentBill.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                                    currentBill.status === 'Partial' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                                    currentBill.status === 'Pending' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                                    'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${currentBill.status === 'Paid' ? 'bg-emerald-500' : currentBill.status === 'Partial' ? 'bg-orange-500' : currentBill.status === 'Pending' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    {currentBill.status}
                                </span>
                            )}
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Remaining Balance</p>
                                <p className="text-4xl sm:text-5xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400 font-mono">
                                    ₱{(currentBill.remainingBalance || 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Amount Paid</p>
                                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono mt-1">
                                    ₱{(currentBill.amountPaid || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-neutral-200/50 dark:border-white/10 pt-6 mt-auto">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Due Date</p>
                                <p className="text-sm font-bold text-neutral-900 dark:text-white">
                                    {isLoading ? "..." : formatDate(currentBill.dueDate || calculateNextDueDate(currentBill.createdAt || ""), { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                <p className="text-[10px] font-medium text-neutral-400 mt-1 max-w-[150px] leading-tight hidden sm:block">
                                    Cycle resets on the {currentBill.creationDay}{getOrdinalSuffix(currentBill.creationDay)} of every month.
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => setIsPaymentModalOpen(true)}
                                // Disable if there's no bill, if it's fully paid, if it's pending, or loading
                                disabled={currentBill.totalAmount === 0 || currentBill.remainingBalance <= 0 || currentBill.status === 'Pending' || isLoading}
                                className={`w-full sm:w-auto px-8 py-3.5 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md ${
                                    currentBill.totalAmount === 0 || currentBill.remainingBalance <= 0 || currentBill.status === 'Pending' || isLoading
                                    ? 'bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-400 cursor-not-allowed border border-neutral-200/50 dark:border-white/5' 
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 border border-indigo-500'
                                }`}
                            >
                                {/* TEXT LOGIC UPDATED HERE */}
                                {isLoading ? 'Loading...' : 
                                 currentBill.totalAmount === 0 ? 'No Bill Yet' :
                                 currentBill.remainingBalance <= 0 ? 'Fully Paid' : 
                                 currentBill.status === 'Pending' ? 'Verification Pending' : 
                                 'Pay Now'}

                                {currentBill.totalAmount > 0 && currentBill.remainingBalance > 0 && currentBill.status !== 'Pending' && !isLoading && (
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-5 relative rounded-[2rem] bg-white/60 dark:bg-[#121212]/60 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 border border-white/40 dark:border-white/10 overflow-hidden flex flex-col p-8 sm:p-10">
                        <div className="absolute inset-0 glass-noise z-0"></div>
                        
                        <div className="relative z-10 mb-6">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2-2v14a2 2 0 002 2z"></path></svg>
                                Bill Breakdown
                            </h3>
                        </div>

                        <div className="relative z-10 flex-1 space-y-4">
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-neutral-500 dark:text-neutral-400">Monthly Rent</span>
                                <span className="text-neutral-900 dark:text-white font-mono">₱{currentBill.breakdown?.rent?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-neutral-500 dark:text-neutral-400">Water Charges</span>
                                <span className="text-neutral-900 dark:text-white font-mono">₱{currentBill.breakdown?.water?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-neutral-500 dark:text-neutral-400">Electricity Charges</span>
                                <span className="text-neutral-900 dark:text-white font-mono">₱{currentBill.breakdown?.electricity?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-semibold pb-4 border-b border-neutral-200/50 dark:border-white/10">
                                <span className="text-neutral-500 dark:text-neutral-400">Other Fees</span>
                                <span className="text-neutral-900 dark:text-white font-mono">₱{currentBill.breakdown?.other?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between items-center text-base font-bold pt-2">
                                <span className="text-neutral-900 dark:text-white">Total Amount</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-mono">₱{currentBill.totalAmount?.toLocaleString() || '0'}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- HISTORY TABLE SECTION --- */}
                <motion.div variants={itemVariants} className="relative bg-white/60 dark:bg-[#121212]/60 rounded-[2rem] border border-white/40 dark:border-white/10 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 overflow-hidden">
                    <div className="absolute inset-0 glass-noise z-0"></div>

                    <div className="relative z-10 p-6 sm:px-8 border-b border-neutral-200/50 dark:border-white/10">
                        <h2 className="text-xl font-bold">Payment History</h2>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">A complete record of your billing and payments.</p>
                    </div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-neutral-200/50 dark:border-white/10">
                                    <th className="px-8 py-6 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-6 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Method & Desc</th>
                                    <th className="px-8 py-6 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-8 py-6 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-6 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-center">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/30 dark:divide-white/5">
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={5} className="px-8 py-32 text-center">
                                                <div className="relative w-12 h-12 mx-auto mb-4">
                                                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                                                    <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                                                </div>
                                                <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 animate-pulse">Fetching history...</p>
                                            </td>
                                        </motion.tr>
                                    ) : payments.length === 0 ? (
                                        <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={5} className="px-8 py-32 text-center">
                                                <div className="w-20 h-20 bg-white dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-neutral-400 dark:text-neutral-500 mx-auto mb-6 shadow-inner border border-neutral-200/50 dark:border-white/5">
                                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                </div>
                                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No Payments Found</h3>
                                                <p className="text-sm font-medium text-neutral-500 mt-2 max-w-xs mx-auto">Your transaction history will appear here once processed.</p>
                                            </td>
                                        </motion.tr>
                                    ) : (
                                        payments.map((p, idx) => (
                                            <motion.tr 
                                                key={p.id || idx} 
                                                variants={itemVariants}
                                                className="group relative hover:bg-white/40 dark:hover:bg-white/[0.02] transition-all duration-300 cursor-default"
                                            >
                                                <td className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-indigo-500 rounded-r-full transition-all duration-300 group-hover:h-3/4 opacity-0 group-hover:opacity-100"></td>

                                                <td className="px-8 py-6 align-middle">
                                                    <p className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {formatDate(p.date)}
                                                    </p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-1">ID: #{p.id?.toString().padStart(5, '0')}</p>
                                                </td>

                                                <td className="px-8 py-6 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-white/5 flex items-center justify-center text-neutral-500 dark:text-neutral-400 shrink-0 shadow-sm">
                                                            {p.method === 'GCash' ? <span className="text-xs font-black text-blue-500">G</span> :
                                                             p.method === 'Bank Transfer' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg> :
                                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[200px]">{p.description}</p>
                                                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-1">{p.method}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-8 py-6 align-middle text-right">
                                                    <p className="text-lg font-black tracking-tight text-neutral-900 dark:text-white font-mono">
                                                        ₱{Number(p.amount).toLocaleString()}
                                                    </p>
                                                </td>

                                                <td className="px-8 py-6 align-middle text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-full border backdrop-blur-sm transition-all ${
                                                        p.status === 'Paid' || p.status === 'Approved'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20' 
                                                        : p.status === 'Pending' 
                                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20'
                                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 group-hover:bg-amber-500/20'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Paid' || p.status === 'Approved' ? 'bg-emerald-500' : p.status === 'Pending' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                                        {p.status}
                                                    </span>
                                                </td>

                                                <td className="px-8 py-6 align-middle text-center">
                                                    {p.hasReceipt ? (
                                                        <button className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-transparent dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30" title="View Receipt">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-neutral-400 dark:text-neutral-600 italic">N/A</span>
                                                    )}
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

            {/* --- PAYMENT MODAL --- */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setIsPaymentModalOpen(false)}
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-lg bg-white dark:bg-[#18181B] rounded-[2rem] shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                            >
                                <div className="p-6 sm:p-8 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center bg-neutral-50/50 dark:bg-white/[0.02]">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">Submit Payment</h2>
                                        <p className="text-sm font-medium text-neutral-500 mt-1">Paying for {currentBill.month} Bill</p>
                                    </div>
                                    <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-500 dark:text-neutral-400 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                
                                <form onSubmit={handlePaymentSubmit} className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Amount to Pay</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-neutral-400">₱</span>
                                            <input 
                                                type="number" required min="1" step="0.01"
                                                value={payAmount}
                                                onChange={(e) => setPayAmount(e.target.value)}
                                                className="w-full bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-5 text-xl font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Payment Method</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['GCash', 'Bank Transfer', 'Cash'].map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setPayMethod(method as any)}
                                                    className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${
                                                        payMethod === method 
                                                        ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                                                        : 'bg-white dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/10'
                                                    }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Upload Proof <span className="text-neutral-400 normal-case font-medium">(Optional)</span></label>
                                        <div 
                                            className="w-full border-2 border-dashed border-neutral-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-neutral-50/50 dark:bg-white/[0.02] transition-colors group"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {proofFile ? (
                                                <>
                                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
                                                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 truncate max-w-xs">{proofFile.name}</p>
                                                    <p className="text-xs text-indigo-500 mt-1 font-medium hover:underline">Click to change file</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                        <svg className="w-6 h-6 text-neutral-400 dark:text-neutral-500 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                    </div>
                                                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Click to browse or drag image here</p>
                                                    <p className="text-xs text-neutral-500 mt-1">PNG, JPG or PDF up to 5MB</p>
                                                </>
                                            )}
                                            <input 
                                                ref={fileInputRef} 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*,.pdf" 
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-100 dark:border-white/5">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className={`w-full py-4 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                                                isSubmitting 
                                                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-wait' 
                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                                            }`}
                                        >
                                            {isSubmitting && <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>}
                                            {isSubmitting ? 'Submitting Payment...' : 'Submit Payment Request'}
                                        </button>
                                        <p className="text-center text-[11px] text-neutral-500 mt-3 font-medium">Your payment will be reviewed by the admin.</p>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}