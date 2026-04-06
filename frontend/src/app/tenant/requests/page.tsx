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

export default function TenantRequests() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Plumbing');
    const [priority, setPriority] = useState('Medium');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            alert("Failed to submit maintenance request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Cancelled': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-10 relative animate-in fade-in slide-in-from-bottom-4 transition-colors duration-500">
            <div className="absolute top-0 left-10 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Maintenance Hub</h1>
                <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2 transition-colors duration-500">Report issues in your room or facility and track their resolution progress.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Left Column: Submission Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl sticky top-8 transition-colors duration-500 overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 dark:from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="mb-8 relative z-10">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Submit New Request</h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-2">{priority} Priority • {category}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Issue Title</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Leaking sink in bathroom"
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 font-bold text-slate-900 dark:text-white transition-all shadow-sm placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Category</label>
                                    <select 
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 font-bold text-slate-900 dark:text-white transition-all shadow-sm appearance-none cursor-pointer"
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
                                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Priority</label>
                                    <select 
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 font-bold text-slate-900 dark:text-white transition-all shadow-sm appearance-none cursor-pointer"
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
                                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Detailed Description</label>
                                <textarea 
                                    required
                                    rows={4}
                                    placeholder="Describe the problem, when it started, and any other relevant details..."
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 font-medium text-slate-900 dark:text-white transition-all shadow-sm resize-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-4.5 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 mt-2 uppercase text-xs tracking-[0.2em] shadow-xl shadow-orange-500/20 active:scale-95"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Request History */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 ml-2">Previous Requests</h2>
                    
                    {isLoading ? (
                        <div className="p-20 text-center bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-xl transition-colors duration-500">
                            <div className="inline-block w-8 h-8 border-4 border-orange-600/20 border-t-orange-600 rounded-full animate-spin"></div>
                            <p className="mt-4 font-black text-slate-400 dark:text-zinc-500 text-xs uppercase tracking-widest">Loading records...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="p-20 text-center bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-xl flex flex-col items-center transition-colors duration-500">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 dark:border-zinc-800">
                                <span className="text-4xl">🛠️</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">No requests yet</h3>
                            <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm mt-3 max-w-sm transition-colors duration-500">You haven't submitted any maintenance requests yet. Use the form on the left if you encounter any issues.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {requests.map(req => (
                                <div key={req.id} className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-300 group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-slate-50 dark:border-zinc-900/50 pb-6 relative z-10">
                                        <div className="flex gap-3 items-center">
                                            <span className="text-[10px] font-black text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-900 pt-1.5 pb-1 px-3 rounded-lg border border-slate-200 dark:border-zinc-800 uppercase tracking-widest">#{req.id}</span>
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all duration-300 ${getStatusBadge(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider bg-slate-50 dark:bg-zinc-900/50 px-4 py-2 rounded-xl self-start sm:self-auto border border-slate-100 dark:border-zinc-800 transition-colors duration-500">
                                            {new Date(req.created_at).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight mb-3 truncate">{req.title}</h3>
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest bg-slate-50 dark:bg-zinc-900/30 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-zinc-800 transition-colors duration-500">{req.category}</span>
                                                <span className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest bg-slate-50 dark:bg-zinc-900/30 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-zinc-800 transition-colors duration-500">{req.priority} Priority</span>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-[#0d0d0d]/60 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-inner min-h-[80px] transition-colors duration-500">
                                                <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                                                    {req.description}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {(req.admin_notes || req.status !== 'Pending') && (
                                            <div className="w-full lg:w-72 shrink-0 bg-orange-50/30 dark:bg-orange-500/5 p-6 rounded-3xl border border-orange-100/50 dark:border-orange-500/10 relative overflow-hidden transition-all duration-500">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-[30px]"></div>
                                                <div className="relative z-10">
                                                    <h4 className="text-[10px] font-black text-orange-800 dark:text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                                                        Resolution Feed
                                                    </h4>
                                                    <p className="text-sm text-orange-900/80 dark:text-orange-300/80 font-medium leading-relaxed">
                                                        {req.admin_notes ? req.admin_notes : 
                                                            req.status === 'Resolved' ? "This issue has been successfully resolved and closed." :
                                                            req.status === 'In Progress' ? "Technical staff have been dispatched and are currently resolving the issue." :
                                                            "Your request has been received and is currently under review by the administration."
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}