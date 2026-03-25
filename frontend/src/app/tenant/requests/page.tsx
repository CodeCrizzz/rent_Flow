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

    // Form State
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
            
            // Reset form
            setTitle('');
            setDescription('');
            setCategory('Plumbing');
            setPriority('Medium');
            
            // Refresh list
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
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Requests</h1>
                <p className="text-slate-500 font-medium mt-1">Report issues in your room or facility and track their resolution progress.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Submission Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 sticky top-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Submit New Request</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">Please provide clear details so our team can assist you efficiently.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Title</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Leaking sink in bathroom"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white font-bold text-slate-700 transition-colors shadow-sm placeholder:font-medium placeholder:text-slate-400"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white font-bold text-slate-700 transition-colors shadow-sm"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white font-bold text-slate-700 transition-colors shadow-sm"
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

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
                                <textarea 
                                    required
                                    rows={4}
                                    placeholder="Describe the problem, when it started, and any other relevant details..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white font-medium text-slate-700 transition-colors shadow-sm resize-none placeholder:text-slate-400"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 mt-2"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Request History */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Your Previous Requests</h2>
                    
                    {isLoading ? (
                        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/50">
                            <div className="inline-block w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-4 font-bold text-slate-400 text-sm">Loading your requests...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 pt-2 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                <span className="text-3xl">🛠️</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-800">No requests yet</h3>
                            <p className="text-slate-500 font-medium text-sm mt-1 max-w-sm">You haven't submitted any maintenance requests yet. Use the form on the left if you encounter any issues.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map(req => (
                                <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(37,99,235,0.08)] transition-all duration-300 group">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 border-b border-slate-50 pb-4">
                                        <div className="flex gap-2 items-center">
                                            <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">#{req.id}</span>
                                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border ${getStatusBadge(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-xl self-start sm:self-auto border border-slate-100">
                                            {new Date(req.created_at).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">{req.title}</h3>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">{req.category}</span>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">{req.priority} Priority</span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                {req.description}
                                            </p>
                                        </div>
                                        
                                        {(req.admin_notes || req.status !== 'Pending') && (
                                            <div className="w-full md:w-64 shrink-0 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-5 rounded-full blur-[20px]"></div>
                                                <div className="relative z-10">
                                                    <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        Admin Updates
                                                    </h4>
                                                    <p className="text-xs text-blue-900 font-medium leading-relaxed">
                                                        {req.admin_notes ? req.admin_notes : 
                                                            req.status === 'Resolved' ? "Issue has been marked as resolved." :
                                                            req.status === 'In Progress' ? "Staff are currently working on this request." :
                                                            "Request is being reviewed."
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