"use client";
import { useEffect, useState, useRef, useMemo } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const formatDate = (dateString: string | null | undefined, options?: Intl.DateTimeFormatOptions) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString(undefined, options || { month: 'short', day: 'numeric', year: 'numeric' });
};

// Default empty state while loading
const defaultBill = {
    month: "Loading...",
    dueDate: new Date().toISOString(),
    totalAmount: 0,
    amountPaid: 0,
    remainingBalance: 0,
    status: "Loading",
    breakdown: { rent: 0, water: 0, electricity: 0, other: 0, penalty: 0 },
    creationDay: 1
};

export default function TenantPayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [currentBill, setCurrentBill] = useState<any>(defaultBill);
    const [summary, setSummary] = useState({ monthTotal: 0, yearTotal: 0, txCount: 0 });
    const [isLoading, setIsLoading] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortBy, setSortBy] = useState("date_desc");

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [viewReceiptUrl, setViewReceiptUrl] = useState<string | null>(null);
    
    const [payAmount, setPayAmount] = useState("");
    const [payMethod, setPayMethod] = useState<'GCash' | 'Bank Transfer' | 'Cash'>('GCash');
    const [payNotes, setPayNotes] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                setIsLoading(true);
                const [billResponse, paymentsResponse] = await Promise.all([
                    api.get('/tenant/bill/current').catch(() => ({ data: null })),
                    api.get('/tenant/payments').catch(() => ({ data: [] }))
                ]);
                
                if (billResponse.data) setCurrentBill(billResponse.data);

                const fetchedPayments = paymentsResponse.data || [];
                setPayments(fetchedPayments);

                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                let mTotal = 0; let yTotal = 0;

                fetchedPayments.forEach((p: any) => {
                    if (p.status === 'Paid' || p.status === 'Approved') {
                        const pDate = new Date(p.date || p.created_at);
                        if (pDate.getFullYear() === currentYear) {
                            yTotal += Number(p.amount);
                            if (pDate.getMonth() === currentMonth) mTotal += Number(p.amount);
                        }
                    }
                });

                setSummary({ monthTotal: mTotal, yearTotal: yTotal, txCount: fetchedPayments.length });
            } catch (error) {
                console.error("Critical error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentData();
    }, []);

    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const refNum = p.referenceNumber || p.id?.toString() || "";
            const desc = p.description || "";
            const matchesSearch = refNum.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  desc.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === "All" || p.status === filterStatus;
            return matchesSearch && matchesStatus;
        }).sort((a, b) => {
            const dateA = new Date(a.date || a.created_at).getTime();
            const dateB = new Date(b.date || b.created_at).getTime();
            if (sortBy === 'date_desc') return dateB - dateA;
            if (sortBy === 'date_asc') return dateA - dateB;
            if (sortBy === 'amount_desc') return Number(b.amount) - Number(a.amount);
            if (sortBy === 'amount_asc') return Number(a.amount) - Number(b.amount);
            return 0;
        });
    }, [payments, searchQuery, filterStatus, sortBy]);

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFileError("");
        if (Number(payAmount) <= 0) return setFileError("Amount must be greater than zero.");
        if (proofFile && proofFile.size > 5 * 1024 * 1024) return setFileError("File exceeds 5MB limit.");
        
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('amount', payAmount);
            formData.append('method', payMethod);
            formData.append('notes', payNotes); 
            if (proofFile) formData.append('proofOfPayment', proofFile);

            const { data } = await api.post('/tenant/payments', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (data.newPayment) {
                setPayments(prev => [data.newPayment, ...prev]);
                setSummary(prev => ({ ...prev, txCount: prev.txCount + 1 }));
            }
            if (data.updatedBill) setCurrentBill(data.updatedBill);
            else setCurrentBill((prev: any) => ({ ...prev, status: 'Pending Verification' }));

            setProofFile(null); setPayAmount(""); setPayNotes(""); setIsPaymentModalOpen(false);
        } catch (error: any) {
            console.error("Payment submission failed:", error);
            setFileError(error.response?.data?.message || "Failed to submit payment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError("");
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) return setFileError("File exceeds 5MB limit.");
            setProofFile(file);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
    };
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Paid': case 'Approved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Pending': case 'Pending Verification': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Overdue': case 'Rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'Partial': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            default: return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full md:pl-[280px] text-neutral-900 dark:text-neutral-100 font-sans flex flex-col bg-transparent overscroll-none overflow-y-auto">
            
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-400/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none -z-10 dark:hidden"></div>
            <div className="fixed bottom-0 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-purple-400/20 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none -z-10 dark:hidden"></div>

            {/* MAIN WRAPPER */}
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto w-full flex flex-col gap-2 sm:gap-3 pt-4 sm:pt-6 px-2 sm:px-8 pb-12 sm:pb-20 lg:pb-32 relative z-10 min-h-full">
                
                {/* --- HEADER --- */}
                <motion.header variants={itemVariants} className="shrink-0 flex flex-row items-center justify-between h-8 sm:h-10 px-1 sm:px-0">
                    <div className="flex flex-row items-center gap-3 sm:gap-4 h-full">
                        <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-neutral-900 via-indigo-800 to-neutral-900 dark:from-white dark:via-indigo-200 dark:to-white leading-none">
                            Payment Center
                        </h1>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-[10px] sm:text-xs font-bold tracking-wide shadow-sm">
                            <span className="relative flex h-2 w-2 sm:h-2 sm:w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 sm:h-2 sm:w-2 bg-indigo-600"></span></span>
                            Billing & Invoices
                        </div>
                    </div>
                </motion.header>

                {/* --- LAYER 1: CURRENT BILL --- */}
                <motion.div variants={itemVariants} className="shrink-0 relative rounded-xl sm:rounded-[1.5rem] bg-white/60 dark:bg-[#121212]/60 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 border border-white/40 dark:border-white/10 overflow-hidden flex flex-col p-4 sm:p-6 lg:p-8">
                    <div className="absolute inset-0 glass-noise z-0 pointer-events-none"></div>
                    {currentBill.status === 'Overdue' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500 z-20 shadow-[0_0_20px_rgba(239,68,68,0.8)]"></div>}

                    <div className="relative z-10 flex justify-between items-start mb-2 sm:mb-4">
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">Current Bill</h3>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white leading-none">{currentBill.month}</p>
                        </div>
                        <span className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full border backdrop-blur-sm ${getStatusColor(currentBill.status)}`}>
                            {currentBill.status}
                        </span>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-neutral-500 mb-1">Remaining</p>
                            <p className={`text-2xl sm:text-4xl font-black tracking-tighter font-mono leading-none ${currentBill.status === 'Overdue' ? 'text-red-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                ₱{currentBill.remainingBalance.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-neutral-500 mb-1">Paid</p>
                            <p className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono leading-none mt-1 sm:mt-1.5">
                                ₱{currentBill.amountPaid.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-neutral-200/50 dark:border-white/10 pt-3 sm:pt-4 mt-auto gap-2">
                        <div className="block">
                            <p className="text-xs sm:text-sm font-medium text-neutral-500">Due Date</p>
                            <p className={`text-sm sm:text-base font-bold ${currentBill.status === 'Overdue' ? 'text-red-500 animate-pulse' : 'text-neutral-900 dark:text-white'}`}>
                                {formatDate(currentBill.dueDate, { month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsPaymentModalOpen(true)}
                            disabled={currentBill.remainingBalance <= 0 || currentBill.status === 'Pending Verification'}
                            className={`w-full sm:w-auto px-4 sm:px-8 py-2.5 sm:py-3 font-bold rounded-xl sm:rounded-xl flex items-center justify-center gap-1 text-sm sm:text-base shrink-0 transition-transform active:scale-95 ${
                                currentBill.remainingBalance <= 0 || currentBill.status === 'Pending Verification'
                                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed border border-neutral-200 dark:border-white/5' 
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500'
                            }`}
                        >
                            Pay Now
                        </button>
                    </div>
                </motion.div>                
                {/* --- LAYER 2: BREAKDOWN & SUMMARY --- */}
                <div className="shrink-0 grid grid-cols-2 gap-2 sm:gap-4">
                    
                    {/* BREAKDOWN CARD */}
                    <motion.div variants={itemVariants} className="relative rounded-xl sm:rounded-[1.5rem] bg-white/60 dark:bg-[#121212]/60 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 border border-white/40 dark:border-white/10 p-3 sm:p-6 lg:p-8 flex flex-col justify-center">
                        <div className="absolute inset-0 glass-noise z-0 pointer-events-none"></div>
                        <h3 className="relative z-10 text-[10px] sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-4">
                            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2-2v14a2 2 0 002 2z"></path></svg> Breakdown
                        </h3>
                        <div className="relative z-10 flex-1 space-y-1 sm:space-y-3">
                            <div className="flex justify-between text-[9px] sm:text-sm font-semibold"><span className="text-neutral-500">Rent</span><span className="font-mono">₱{(currentBill.breakdown?.rent || 0).toLocaleString()}</span></div>
                            <div className="flex justify-between text-[9px] sm:text-sm font-semibold"><span className="text-neutral-500">Water</span><span className="font-mono">₱{(currentBill.breakdown?.water || 0).toLocaleString()}</span></div>
                            <div className="flex justify-between text-[9px] sm:text-sm font-semibold"><span className="text-neutral-500">Power</span><span className="font-mono">₱{(currentBill.breakdown?.electricity || 0).toLocaleString()}</span></div>
                            {currentBill.breakdown?.penalty > 0 && (
                                <div className="flex justify-between text-[9px] sm:text-sm font-semibold text-red-500"><span className="flex items-center gap-0.5 sm:gap-1"><svg className="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Penalty</span><span className="font-mono">₱{currentBill.breakdown.penalty.toLocaleString()}</span></div>
                            )}
                            <div className="flex justify-between text-[10px] sm:text-base font-bold pt-1.5 sm:pt-3 border-t border-neutral-200/50 dark:border-white/10 mt-0.5 sm:mt-0"><span className="text-neutral-900 dark:text-white">Total</span><span className="text-indigo-600 dark:text-indigo-400 font-mono">₱{(currentBill.totalAmount || 0).toLocaleString()}</span></div>
                        </div>
                    </motion.div>
                    {/* SUMMARY CARD */}
                    <motion.div variants={itemVariants} className="relative rounded-xl sm:rounded-[1.5rem] bg-white/60 dark:bg-[#121212]/60 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 border border-white/40 dark:border-white/10 p-3 sm:p-6 lg:p-8 flex flex-col justify-center">
                        <div className="absolute inset-0 glass-noise z-0 pointer-events-none"></div>
                        <h3 className="relative z-10 text-[10px] sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-4">
                            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> Summary
                        </h3>
                        <div className="relative z-10 flex-1 space-y-1 sm:space-y-3">
                            <div className="flex justify-between text-[9px] sm:text-sm font-semibold"><span className="text-neutral-500">Month</span><span className="font-mono text-emerald-600 dark:text-emerald-400">₱{summary.monthTotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-[9px] sm:text-sm font-semibold"><span className="text-neutral-500">Year</span><span className="font-mono text-emerald-600 dark:text-emerald-400">₱{summary.yearTotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-[9px] sm:text-sm font-semibold border-t border-neutral-200/50 dark:border-white/10 pt-1.5 sm:pt-3 mt-0.5 sm:mt-0"><span className="text-neutral-500">Txns</span><span className="font-mono font-bold text-neutral-900 dark:text-white">{summary.txCount}</span></div>
                        </div>
                    </motion.div>
                </div>            

                {/* --- LAYER 3: FILTERS & TABLE SECTION --- */}
                <motion.div variants={itemVariants} className="flex-1 flex flex-col relative bg-white/60 dark:bg-[#121212]/60 rounded-xl sm:rounded-[1.5rem] border border-white/40 dark:border-white/10 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 overflow-hidden min-h-[450px] mb-12 sm:mb-24">
                    <div className="absolute inset-0 glass-noise z-0 pointer-events-none"></div>

                    {/* Toolbar */}
                    <div className="relative z-10 shrink-0 p-2 sm:p-4 border-b border-neutral-200/50 dark:border-white/10 bg-white/40 dark:bg-[#121212]/40 backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-3 overflow-x-auto">
                        <div className="relative w-full sm:w-64 h-8 sm:h-12 shrink-0 flex items-center">
                            <svg className="absolute left-2.5 sm:left-4 w-3.5 h-3.5 sm:w-5 sm:h-5 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-full bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-lg sm:rounded-xl pl-8 sm:pl-12 pr-2.5 sm:pr-4 text-[10px] sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white m-0" />
                        </div>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full sm:w-auto h-8 sm:h-12 bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-lg sm:rounded-xl px-1.5 sm:px-3 text-[10px] sm:text-sm outline-none cursor-pointer text-neutral-900 dark:text-white shrink-0 m-0">
                            <option value="All" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">All Status</option>
                            <option value="Paid" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Paid</option>
                            <option value="Pending" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Pending</option>
                            <option value="Rejected" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Rejected</option>
                        </select>
                        <div className="ml-auto w-full sm:w-auto flex items-center gap-1.5 sm:gap-3 shrink-0">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex-1 sm:flex-none h-8 sm:h-12 bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-lg sm:rounded-xl px-1.5 sm:px-3 text-[10px] sm:text-sm outline-none cursor-pointer text-neutral-900 dark:text-white shrink-0 m-0">
                                <option value="date_desc" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Newest</option>
                                <option value="date_asc" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Oldest</option>
                                <option value="amount_desc" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">High-Low</option>
                                <option value="amount_asc" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Low-High</option>
                            </select>
                            <button onClick={() => alert("Exporting CSV")} className="h-8 sm:h-12 px-2.5 sm:px-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] sm:text-sm rounded-lg sm:rounded-xl border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 flex items-center justify-center gap-1 sm:gap-1.5 transition-colors m-0">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> <span className="inline">Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="relative z-10 flex-1 overflow-x-auto pr-1 pb-4 sm:pb-6">
                        <table className="w-full text-left border-collapse min-w-[350px] sm:min-w-[800px] mb-4">
                            <thead className="sticky top-0 z-20 bg-neutral-50/95 dark:bg-[#18181B]/95 backdrop-blur-md shadow-sm">
                                <tr>
                                    <th className="px-1.5 py-1.5 sm:px-4 sm:py-4 text-[7px] sm:text-[12px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Date / Ref</th>
                                    <th className="px-1.5 py-1.5 sm:px-4 sm:py-4 text-[7px] sm:text-[12px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Method & Desc</th>
                                    <th className="px-1.5 py-1.5 sm:px-4 sm:py-4 text-[7px] sm:text-[12px] font-bold text-neutral-400 uppercase tracking-widest text-right leading-none">Amount</th>
                                    <th className="px-1.5 py-1.5 sm:px-4 sm:py-4 text-[7px] sm:text-[12px] font-bold text-neutral-400 uppercase tracking-widest text-center leading-none">Status</th>
                                    <th className="px-1.5 py-1.5 sm:px-4 sm:py-4 text-[7px] sm:text-[12px] font-bold text-neutral-400 uppercase tracking-widest text-center leading-none">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/30 dark:divide-white/5">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-6 text-center text-neutral-500 text-[10px] sm:text-base">No transactions match your filters.</td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((p) => (
                                        <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-white/40 dark:hover:bg-white/[0.02] transition-all duration-300">
                                            <td className="px-1.5 py-1.5 sm:px-4 sm:py-4 align-middle">
                                                <p className="font-bold text-[7px] sm:text-sm text-neutral-900 dark:text-white leading-tight">{formatDate(p.date)}</p>
                                                <p className="text-[6px] sm:text-xs font-mono text-neutral-400 leading-tight">{p.referenceNumber}</p>
                                            </td>
                                            <td className="px-1.5 py-1.5 sm:px-4 sm:py-4 align-middle flex items-center gap-1.5 sm:gap-4 min-w-0">
                                                <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-md sm:rounded-xl bg-white/50 dark:bg-black/30 border border-neutral-200/50 dark:border-white/5 flex items-center justify-center shrink-0">
                                                    {p.method.includes('GCash') ? <span className="text-[8px] sm:text-sm font-black text-blue-500">G</span> : <svg className="w-3 h-3 sm:w-5 sm:h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[7px] sm:text-sm font-bold truncate max-w-[90px] sm:max-w-[250px] text-neutral-900 dark:text-white leading-tight">{p.description}</p>
                                                    <p className="text-[6px] sm:text-xs text-neutral-500 leading-tight">{p.method}</p>
                                                </div>
                                            </td>
                                            <td className="px-1.5 py-1.5 sm:px-4 sm:py-4 align-middle text-right">
                                                <p className="text-[8px] sm:text-base font-black font-mono text-neutral-900 dark:text-white leading-tight">₱{Number(p.amount).toLocaleString()}</p>
                                            </td>
                                            <td className="px-1.5 py-1.5 sm:px-4 sm:py-4 align-middle text-center">
                                                <span className={`inline-flex items-center px-1 py-0.5 sm:px-3 sm:py-1.5 text-[6px] sm:text-xs font-bold uppercase tracking-widest rounded-full border ${getStatusColor(p.status)}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-1.5 py-1.5 sm:px-4 sm:py-4 align-middle text-center">
                                                {p.hasReceipt ? (
                                                    <button onClick={() => setViewReceiptUrl(p.receiptUrl)} className="p-1 sm:p-2.5 rounded-md bg-neutral-100 dark:bg-white/5 hover:text-indigo-600 transition-colors">
                                                        <svg className="w-3 h-3 sm:w-5 sm:h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                    </button>
                                                ) : <span className="text-[6px] sm:text-xs text-neutral-400 italic">N/A</span>}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

            </motion.div>

            {/* --- Modals --- */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-neutral-900/60 dark:bg-black/70 backdrop-blur-sm z-[100]" onClick={() => !isSubmitting && setIsPaymentModalOpen(false)} />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-md bg-white dark:bg-[#18181B] rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]">
                                <div className="p-5 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center bg-neutral-50/50 dark:bg-white/[0.02]">
                                    <div><h2 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white">Submit Payment</h2><p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Paying for {currentBill.month} Bill</p></div>
                                    <button onClick={() => !isSubmitting && setIsPaymentModalOpen(false)} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                </div>
                                <form onSubmit={handlePaymentSubmit} className="p-5 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain flex flex-col gap-4">
                                    {fileError && <div className="p-3 bg-red-500/10 rounded-xl text-red-500 text-xs font-bold">{fileError}</div>}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Amount</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base font-bold text-neutral-400">₱</span>
                                                <input type="number" required min="1" step="0.01" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="w-full bg-neutral-50 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl py-2.5 sm:py-3 pl-9 pr-3 sm:pr-4 text-sm sm:text-base font-bold outline-none text-neutral-900 dark:text-white" />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Method</label>
                                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                                {['GCash', 'Bank', 'Cash'].map((m) => (
                                                    <button key={m} type="button" onClick={() => setPayMethod(m as any)} className={`py-2 rounded-lg text-xs sm:text-sm font-bold border ${payMethod === m || (payMethod === 'Bank Transfer' && m === 'Bank') ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-500'}`}>{m}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Notes (Optional)</label>
                                            <textarea rows={3} value={payNotes} onChange={(e) => setPayNotes(e.target.value)} className="w-full bg-neutral-50 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs sm:text-sm outline-none resize-none text-neutral-900 dark:text-white" />
                                        </div>
                                        <div className="col-span-2">
                                            <div className="w-full border-2 border-dashed border-neutral-200 dark:border-white/10 rounded-xl p-4 sm:p-5 flex flex-col items-center cursor-pointer bg-neutral-50/50 dark:bg-white/[0.02]" onClick={() => fileInputRef.current?.click()}>
                                                {proofFile ? <span className="text-xs sm:text-sm font-bold text-indigo-500 truncate px-2">{proofFile.name}</span> : <span className="text-xs sm:text-sm font-bold text-neutral-400">Tap to Upload Proof</span>}
                                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="w-full py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white mt-2 transition-colors">{isSubmitting ? 'Processing...' : 'Submit Payment'}</button>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
                {viewReceiptUrl && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200]" onClick={() => setViewReceiptUrl(null)} />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[201] pointer-events-none">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative pointer-events-auto flex flex-col items-center">
                                <button onClick={() => setViewReceiptUrl(null)} className="absolute -top-10 sm:-top-12 right-0 p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                <img src={viewReceiptUrl} alt="Receipt" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10" />
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}