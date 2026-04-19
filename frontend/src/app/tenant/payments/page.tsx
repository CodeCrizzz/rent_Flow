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

    // Fetch Data from Database
    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const [billResponse, paymentsResponse] = await Promise.all([
                    api.get('/tenant/bill/current').catch(err => {
                        console.warn("Current Bill endpoint not found (404)");
                        return { data: defaultBill }; 
                    }),
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

    // Handle form submission to the backend
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

    // --- ANIMATIONS ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.12, delayChildren: 0.1 } 
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, filter: "blur(15px)" },
        visible: { 
            opacity: 1, y: 0, filter: "blur(0px)", 
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
        }
    };

    return (
        <div className="w-full h-[100dvh] text-neutral-900 dark:text-neutral-100 font-sans flex flex-col bg-transparent relative overflow-hidden [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            
            {/* Ambient Background Glows - Hidden in dark mode to prevent border artifacts */}
            <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-400/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:hidden"></div>
            <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-purple-400/20 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none -z-10 mix-blend-multiply dark:hidden"></div>

            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto w-full h-full flex flex-col space-y-3 sm:space-y-6 pt-4 sm:pt-6 px-3 sm:px-6 lg:px-8 pb-4 relative z-10">
                
                {/* --- HEADER --- */}
                <motion.header variants={itemVariants} className="shrink-0 flex flex-row items-end justify-between gap-4 sm:gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-[8px] sm:text-xs font-bold tracking-wide mb-1 sm:mb-4 shadow-sm">
                            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-indigo-600"></span>
                            </span>
                            Billing & Invoices
                        </div>
                        <h1 className="text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-neutral-900 via-indigo-800 to-neutral-900 dark:from-white dark:via-indigo-200 dark:to-white drop-shadow-sm pb-1 leading-tight">
                            Payment Center
                        </h1>
                    </div>
                </motion.header>

                {/* --- BENTO GRID LAYOUT --- */}
                <div className="shrink-0 grid grid-cols-12 gap-3 sm:gap-6">
                    
                    {/* CURRENT BILL CARD */}
                    <motion.div variants={itemVariants} className="col-span-7 relative rounded-2xl sm:rounded-4xl bg-white/60 dark:bg-[#121212]/60 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 border border-white/40 dark:border-white/10 overflow-hidden flex flex-col p-3 sm:p-8 lg:p-10">
                        <div className="absolute inset-0 glass-noise z-0"></div>
                        <div className="absolute top-0 right-0 -mr-10 sm:-mr-20 -mt-10 sm:-mt-20 w-32 sm:w-72 h-32 sm:h-72 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-xl sm:blur-3xl pointer-events-none z-0"></div>

                        <div className="relative z-10 flex justify-between items-start mb-3 sm:mb-8">
                            <div>
                                <h3 className="text-[8px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5 sm:mb-1">Current Bill</h3>
                                <p className="text-[10px] sm:text-xl font-bold text-neutral-900 dark:text-white">
                                    {currentBill.totalAmount === 0 && !isLoading ? "No Active Bill" : currentBill.month}
                                </p>
                            </div>
                            {!isLoading && currentBill.totalAmount > 0 && (
                                <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[7px] sm:text-[11px] font-bold uppercase tracking-widest rounded-full border backdrop-blur-sm ${
                                    currentBill.status === 'Paid' || currentBill.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                                    currentBill.status === 'Partial' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                                    currentBill.status === 'Pending' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                                    'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                }`}>
                                    <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${currentBill.status === 'Paid' ? 'bg-emerald-500' : currentBill.status === 'Partial' ? 'bg-orange-500' : currentBill.status === 'Pending' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    {currentBill.status}
                                </span>
                            )}
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-8 mb-3 sm:mb-8">
                            <div>
                                <p className="text-[7px] sm:text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-0.5 sm:mb-1">Remaining Balance</p>
                                <p className="text-xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400 font-mono break-all leading-none">
                                    ₱{(currentBill.remainingBalance || 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-[7px] sm:text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-0.5 sm:mb-1">Amount Paid</p>
                                <p className="text-sm sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono mt-0.5 sm:mt-1 break-all leading-none">
                                    ₱{(currentBill.amountPaid || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-row items-center justify-between border-t border-neutral-200/50 dark:border-white/10 pt-3 sm:pt-6 mt-auto gap-2">
                            <div className="flex flex-col">
                                <p className="text-[7px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-400">Due Date</p>
                                <p className="text-[8px] sm:text-sm font-bold text-neutral-900 dark:text-white">
                                    {isLoading ? "..." : formatDate(currentBill.dueDate || calculateNextDueDate(currentBill.createdAt || ""), { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => setIsPaymentModalOpen(true)}
                                disabled={currentBill.totalAmount === 0 || currentBill.remainingBalance <= 0 || currentBill.status === 'Pending' || isLoading}
                                className={`px-3 sm:px-8 py-1.5 sm:py-3.5 font-bold rounded-lg sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 backdrop-blur-md text-[8px] sm:text-base shrink-0 ${
                                    currentBill.totalAmount === 0 || currentBill.remainingBalance <= 0 || currentBill.status === 'Pending' || isLoading
                                    ? 'bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-400 cursor-not-allowed border border-neutral-200/50 dark:border-white/5' 
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 border border-indigo-500'
                                }`}
                            >
                                {isLoading ? 'Loading...' : 
                                 currentBill.totalAmount === 0 ? 'No Bill' :
                                 currentBill.remainingBalance <= 0 ? 'Fully Paid' : 
                                 currentBill.status === 'Pending' ? 'Pending' : 
                                 'Pay Now'}
                            </button>
                        </div>
                    </motion.div>

                    {/* BILL BREAKDOWN CARD */}
                    <motion.div variants={itemVariants} className="col-span-5 relative rounded-2xl sm:rounded-4xl bg-white/60 dark:bg-[#121212]/60 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 border border-white/40 dark:border-white/10 overflow-hidden flex flex-col p-3 sm:p-8 lg:p-10">
                        <div className="absolute inset-0 glass-noise z-0"></div>
                        
                        <div className="relative z-10 mb-3 sm:mb-6">
                            <h3 className="text-[10px] sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                                <svg className="w-3 h-3 sm:w-5 sm:h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2-2v14a2 2 0 002 2z"></path></svg>
                                Breakdown
                            </h3>
                        </div>

                        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-2 sm:space-y-4">
                            <div className="flex justify-between items-center text-[8px] sm:text-sm font-semibold">
                                <span className="text-neutral-500 dark:text-neutral-400">Rent</span>
                                <span className="text-neutral-900 dark:text-white font-mono">₱{(currentBill.breakdown?.rent || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[8px] sm:text-sm font-semibold">
                                <span className="text-neutral-500 dark:text-neutral-400">Water</span>
                                <span className="text-neutral-900 dark:text-white font-mono">₱{(currentBill.breakdown?.water || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[8px] sm:text-sm font-semibold">
                                <span className="text-neutral-500 dark:text-neutral-400">Electricity</span>
                                <span className="text-neutral-900 dark:text-white font-mono">₱{(currentBill.breakdown?.electricity || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[8px] sm:text-sm font-semibold pb-2 sm:pb-4 border-b border-neutral-200/50 dark:border-white/10">
                                <span className="text-neutral-500 dark:text-neutral-400">Other</span>
                                <span className="text-neutral-900 dark:text-white font-mono">₱{(currentBill.breakdown?.other || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] sm:text-base font-bold pt-1 sm:pt-2">
                                <span className="text-neutral-900 dark:text-white">Total</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-mono">₱{(currentBill.totalAmount || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- HISTORY TABLE SECTION (Constrained height on mobile) --- */}
                <motion.div variants={itemVariants} className="flex flex-col min-h-0 max-h-[280px] sm:max-h-full sm:flex-1 relative bg-white/60 dark:bg-[#121212]/60 rounded-2xl sm:rounded-4xl border border-white/40 dark:border-white/10 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 overflow-hidden">
                    <div className="absolute inset-0 glass-noise z-0 pointer-events-none"></div>

                    {/* Sticky Table Header */}
                    <div className="relative z-10 shrink-0 p-3 sm:p-6 lg:px-8 border-b border-neutral-200/50 dark:border-white/10 bg-white/40 dark:bg-[#121212]/40 backdrop-blur-md flex flex-row items-center justify-between gap-2 sm:gap-4">
                        <div>
                            <h2 className="text-sm sm:text-xl font-bold">Payment History</h2>
                            <p className="text-[8px] sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1">A complete record of your billing and payments.</p>
                        </div>
                    </div>

                    {/* Scrollable Table Body */}
                    <div className="relative z-10 flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-[700px]">
                            <thead className="sticky top-0 z-20 bg-neutral-50/90 dark:bg-[#18181B]/90 backdrop-blur-md">
                                <tr className="border-b border-neutral-200/50 dark:border-white/10">
                                    <th className="px-3 py-2 sm:px-6 sm:py-5 text-[8px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Date</th>
                                    <th className="px-3 py-2 sm:px-6 sm:py-5 text-[8px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Desc</th>
                                    <th className="px-3 py-2 sm:px-6 sm:py-5 text-[8px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-3 py-2 sm:px-6 sm:py-5 text-[8px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-3 py-2 sm:px-6 sm:py-5 text-[8px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-center">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/30 dark:divide-white/5">
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={5} className="px-4 py-8 sm:py-20 text-center">
                                                <div className="relative w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4">
                                                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                                                    <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ) : payments.length === 0 ? (
                                        <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={5} className="px-4 py-8 sm:py-20 text-center">
                                                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white dark:bg-white/5 rounded-xl sm:rounded-3xl flex items-center justify-center text-neutral-400 dark:text-neutral-500 mx-auto mb-2 sm:mb-4 shadow-inner border border-neutral-200/50 dark:border-white/5">
                                                    <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                </div>
                                                <h3 className="text-xs sm:text-lg font-bold text-neutral-900 dark:text-white">No Payments Found</h3>
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

                                                <td className="px-3 py-3 sm:px-6 sm:py-5 align-middle">
                                                    <p className="font-bold text-[9px] sm:text-sm text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {formatDate(p.date)}
                                                    </p>
                                                    <p className="text-[7px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-0.5 sm:mt-1">ID: #{p.id?.toString().padStart(5, '0')}</p>
                                                </td>

                                                <td className="px-3 py-3 sm:px-6 sm:py-5 align-middle flex items-center gap-2 sm:gap-4 min-w-0">
                                                    <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-white/5 flex items-center justify-center text-neutral-500 dark:text-neutral-400 shrink-0 shadow-sm">
                                                        {p.method === 'GCash' ? <span className="text-[8px] sm:text-xs font-black text-blue-500">G</span> :
                                                            p.method === 'Bank Transfer' ? <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg> :
                                                            <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] sm:text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[100px] sm:max-w-[200px]">{p.description}</p>
                                                        <p className="text-[7px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1">{p.method}</p>
                                                    </div>
                                                </td>

                                                <td className="px-3 py-3 sm:px-6 sm:py-5 align-middle text-right">
                                                    <p className="text-[10px] sm:text-lg font-black tracking-tight text-neutral-900 dark:text-white font-mono">
                                                        ₱{Number(p.amount).toLocaleString()}
                                                    </p>
                                                </td>

                                                <td className="px-3 py-3 sm:px-6 sm:py-5 align-middle text-center">
                                                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 text-[7px] sm:text-[11px] font-bold uppercase tracking-widest rounded-full border backdrop-blur-sm transition-all ${
                                                        p.status === 'Paid' || p.status === 'Approved'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20' 
                                                        : p.status === 'Pending' 
                                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20'
                                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 group-hover:bg-amber-500/20'
                                                    }`}>
                                                        <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${p.status === 'Paid' || p.status === 'Approved' ? 'bg-emerald-500' : p.status === 'Pending' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                                        {p.status}
                                                    </span>
                                                </td>

                                                <td className="px-3 py-3 sm:px-6 sm:py-5 align-middle text-center">
                                                    {p.hasReceipt ? (
                                                        <button className="p-1.5 sm:p-2 rounded-md sm:rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-transparent dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30" title="View Receipt">
                                                            <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                        </button>
                                                    ) : (
                                                        <span className="text-[7px] sm:text-xs text-neutral-400 dark:text-neutral-600 italic">N/A</span>
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
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-neutral-900/60 dark:bg-black/70 backdrop-blur-sm z-[100]"
                            onClick={() => setIsPaymentModalOpen(false)}
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-[101] pointer-events-none">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-lg bg-white dark:bg-[#18181B] rounded-3xl sm:rounded-4xl shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden pointer-events-auto flex flex-col max-h-[85vh] sm:max-h-[90vh]"
                            >
                                <div className="p-4 sm:p-6 lg:p-8 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center bg-neutral-50/50 dark:bg-white/[0.02] shrink-0">
                                    <div>
                                        <h2 className="text-base sm:text-xl font-extrabold text-neutral-900 dark:text-white">Submit Payment</h2>
                                        <p className="text-[10px] sm:text-sm font-medium text-neutral-500 mt-0.5 sm:mt-1">Paying for {currentBill.month} Bill</p>
                                    </div>
                                    <button onClick={() => setIsPaymentModalOpen(false)} className="p-1.5 sm:p-2 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-500 dark:text-neutral-400 transition-colors">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                
                                <form onSubmit={handlePaymentSubmit} className="p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-[9px] sm:text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-base sm:text-xl font-bold text-neutral-400">₱</span>
                                            <input 
                                                type="number" required min="1" step="0.01"
                                                value={payAmount}
                                                onChange={(e) => setPayAmount(e.target.value)}
                                                className="w-full bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-8 sm:pl-12 pr-4 sm:pr-5 text-base sm:text-xl font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[9px] sm:text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Method</label>
                                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                            {['GCash', 'Bank', 'Cash'].map((method) => (
                                                <button
                                                    key={method}
                                                    type="button"
                                                    onClick={() => setPayMethod(method as any)}
                                                    className={`py-2 sm:py-3 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[9px] sm:text-sm font-bold border transition-all ${
                                                        payMethod === method || (payMethod === 'Bank Transfer' && method === 'Bank') 
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
                                        <label className="block text-[9px] sm:text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Proof <span className="text-neutral-400 normal-case font-medium">(Optional)</span></label>
                                        <div 
                                            className="w-full border-2 border-dashed border-neutral-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-neutral-50/50 dark:bg-white/[0.02] transition-colors group"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {proofFile ? (
                                                <>
                                                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-1.5 sm:mb-3">
                                                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                    <p className="text-[10px] sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 truncate max-w-[150px] sm:max-w-xs">{proofFile.name}</p>
                                                    <p className="text-[8px] sm:text-xs text-indigo-500 mt-1 font-medium hover:underline">Change file</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white dark:bg-white/5 rounded-full flex items-center justify-center shadow-sm mb-1.5 sm:mb-3 group-hover:scale-110 transition-transform">
                                                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-neutral-400 dark:text-neutral-500 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                    </div>
                                                    <p className="text-[10px] sm:text-sm font-bold text-neutral-700 dark:text-neutral-300">Tap to attach image</p>
                                                </>
                                            )}
                                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                                        </div>
                                    </div>

                                    <div className="pt-2 sm:pt-4 border-t border-neutral-100 dark:border-white/5 mt-auto">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className={`w-full py-3 sm:py-4 text-[10px] sm:text-sm font-bold rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                                                isSubmitting 
                                                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-wait' 
                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5'
                                            }`}
                                        >
                                            {isSubmitting && <div className="w-3 h-3 sm:w-5 sm:h-5 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>}
                                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                        </button>
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