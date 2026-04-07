"use client";
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface Request {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
    admin_notes: string | null;
    image_url?: string | null;
}

export default function TenantRequests() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Plumbing');
    const [priority, setPriority] = useState('Medium');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal State
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('priority', priority);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await api.post('/requests', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setTitle('');
            setDescription('');
            setCategory('Plumbing');
            setPriority('Medium');
            setImageFile(null);
            
            await fetchMyRequests();
        } catch (error) {
            console.error("Failed to submit request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleCancelRequest = async (id: number) => {
        try {
            await api.put(`/requests/${id}/cancel`);
            setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Cancelled' } : req));
        } catch (error) {
            console.error("Failed to cancel request", error);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400';
            case 'In Progress': return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
            case 'Cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400';
            default: return 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20 dark:text-neutral-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Urgent': return 'text-red-600 dark:text-red-400';
            case 'High': return 'text-orange-600 dark:text-orange-400';
            case 'Medium': return 'text-amber-600 dark:text-amber-400';
            case 'Low': return 'text-emerald-600 dark:text-emerald-400';
            default: return 'text-neutral-600 dark:text-neutral-400';
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
        <div className="w-full h-[calc(100vh-2rem)] text-neutral-900 dark:text-neutral-100 font-sans flex flex-col bg-transparent relative overflow-hidden [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:hidden"></div>
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-multiply dark:hidden"></div>

            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto w-full flex flex-col h-full space-y-6 pt-6 px-4 sm:px-6 lg:px-8 pb-4 relative z-10">
                
                {/* --- HEADER --- */}
                <motion.header variants={itemVariants} className="flex justify-between items-end shrink-0">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Facility Support</h1>
                    </div>
                </motion.header>

                {/* --- COMPACT SUBMISSION FORM --- */}
                <motion.div variants={itemVariants} className="bg-white/60 dark:bg-[#121212]/60 p-6 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl shadow-indigo-500/5 backdrop-blur-2xl relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 glass-noise z-0"></div>
                    <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-6 space-y-1.5">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Issue Title</label>
                            <input type="text" required placeholder="e.g. Leaking faucet" value={title} onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-semibold text-neutral-900 dark:text-white transition-all shadow-sm text-sm"
                            />
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-semibold text-neutral-900 dark:text-white transition-all shadow-sm text-sm appearance-none cursor-pointer"
                            >
                                <option value="Plumbing">Plumbing</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-semibold text-neutral-900 dark:text-white transition-all shadow-sm text-sm appearance-none cursor-pointer"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                        <div className="md:col-span-8 space-y-1.5">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Description</label>
                            <textarea required rows={2} placeholder="Brief details of the problem..." value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-semibold text-neutral-900 dark:text-white transition-all shadow-sm text-sm resize-none"
                            />
                        </div>
                        <div className="md:col-span-4 flex flex-col gap-3 justify-end">
                            <div className="w-full border-2 border-dashed border-neutral-200 dark:border-white/10 hover:border-indigo-400 rounded-xl p-2 flex items-center justify-center text-center cursor-pointer bg-neutral-50/50 dark:bg-white/[0.02] transition-colors"
                                onClick={() => fileInputRef.current?.click()}>
                                {imageFile ? (
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate px-2">{imageFile.name}</span>
                                ) : (
                                    <span className="text-xs font-bold text-neutral-500 flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Attach Image</span>
                                )}
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <button type="submit" disabled={isSubmitting} className={`w-full py-3 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm ${isSubmitting ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 border border-indigo-500'}`}>
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* --- COMPACT REQUESTS TABLE (Internal Scroll Only) --- */}
                <motion.div variants={itemVariants} className="relative bg-white/60 dark:bg-[#121212]/60 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl shadow-indigo-500/5 backdrop-blur-2xl flex-1 flex flex-col overflow-hidden">
                    <div className="absolute inset-0 glass-noise z-0"></div>
                    <div className="relative z-10 p-5 sm:px-6 border-b border-neutral-200/50 dark:border-white/10 shrink-0">
                        <h2 className="text-lg font-bold">My Requests</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto relative z-10 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <table className="w-full text-left border-collapse min-w-[700px] whitespace-nowrap">
                            <thead className="sticky top-0 z-20 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md">
                                <tr className="border-b border-neutral-200/50 dark:border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Issue</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-center">Priority</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-center">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/30 dark:divide-white/5">
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="inline-block w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                            </td>
                                        </motion.tr>
                                    ) : requests.length === 0 ? (
                                        <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={6} className="px-6 py-16 text-center text-sm font-medium text-neutral-500">No requests found.</td>
                                        </motion.tr>
                                    ) : (
                                        requests.map((req) => (
                                            <motion.tr key={req.id} className="hover:bg-white/40 dark:hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4 align-middle text-xs font-bold text-neutral-500">#{req.id.toString().padStart(4, '0')}</td>
                                                <td className="px-6 py-4 align-middle">
                                                    <p className="text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[200px]">{req.title}</p>
                                                    <p className="text-[10px] font-medium text-neutral-500">{req.category}</p>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-center">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${getPriorityColor(req.priority)}`}>{req.priority}</span>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-center text-xs font-medium text-neutral-500">
                                                    {new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 align-middle text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${getStatusStyles(req.status)}`}>{req.status}</span>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-right">
                                                    <button onClick={() => setSelectedRequest(req)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors">View</button>
                                                    {req.status === 'Pending' && <button onClick={() => handleCancelRequest(req.id)} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors ml-4">Cancel</button>}
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

            {/* --- SMOOTH MODAL --- */}
            <AnimatePresence>
                {selectedRequest && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-sm z-[100]" 
                            onClick={() => setSelectedRequest(null)} 
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-md bg-white dark:bg-[#18181B] rounded-[2rem] shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden pointer-events-auto"
                            >
                                <div className="p-6 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center bg-neutral-50/50 dark:bg-white/[0.02]">
                                    <h2 className="text-lg font-bold">Request Details</h2>
                                    <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <h3 className="text-xl font-bold">{selectedRequest.title}</h3>
                                    <div className="bg-neutral-50 dark:bg-black/20 p-4 rounded-2xl text-sm leading-relaxed">{selectedRequest.description}</div>
                                    <div className="border-t border-neutral-100 dark:border-white/5 pt-5">
                                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Admin Notes</h4>
                                        {selectedRequest.admin_notes ? (
                                            <div className="flex gap-3 items-start bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl text-sm text-indigo-900 dark:text-indigo-200">
                                                {selectedRequest.admin_notes}
                                            </div>
                                        ) : <p className="text-sm text-neutral-400 italic">No updates yet.</p>}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}