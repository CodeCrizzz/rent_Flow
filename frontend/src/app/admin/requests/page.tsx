"use client";
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';

interface Request {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
    assigned_to: string | null;
    admin_notes: string | null;
    tenant_name: string;
    room_number: string | null;
    scheduled_date: string | null;
    date_resolved: string | null;
}

export default function AdminRequests() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Modals
    const [viewModalReq, setViewModalReq] = useState<Request | null>(null);
    const [updateModalReq, setUpdateModalReq] = useState<Request | null>(null);

    // Update Form State
    const [updateStatus, setUpdateStatus] = useState('');
    const [updatePriority, setUpdatePriority] = useState('');
    const [updateAssigned, setUpdateAssigned] = useState('');
    const [updateNotes, setUpdateNotes] = useState('');
    const [updateScheduledDate, setUpdateScheduledDate] = useState('');
    const [updateDateResolved, setUpdateDateResolved] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get('/requests');
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = 
                req.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                req.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
            const matchesPriority = priorityFilter === 'All' || req.priority === priorityFilter;
            const matchesCategory = categoryFilter === 'All' || req.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
        });
    }, [requests, searchTerm, statusFilter, priorityFilter, categoryFilter]);

    const openUpdateModal = (req: Request) => {
        setUpdateModalReq(req);
        setUpdateStatus(req.status);
        setUpdatePriority(req.priority);
        setUpdateAssigned(req.assigned_to || '');
        setUpdateNotes(req.admin_notes || '');
        setUpdateScheduledDate(req.scheduled_date ? new Date(req.scheduled_date).toISOString().split('T')[0] : '');
        setUpdateDateResolved(req.date_resolved ? new Date(req.date_resolved).toISOString().split('T')[0] : '');
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!updateModalReq) return;
        
        try {
            setIsUpdating(true);
            await api.put(`/requests/${updateModalReq.id}`, {
                status: updateStatus,
                priority: updatePriority,
                assigned_to: updateAssigned,
                admin_notes: updateNotes,
                scheduled_date: updateScheduledDate || null,
                date_resolved: updateDateResolved || null
            });
            await fetchRequests();
            setUpdateModalReq(null);
        } catch (error) {
            console.error("Failed to update request:", error);
            alert("Failed to update request");
        } finally {
            setIsUpdating(false);
        }
    };

    // Dark Mode Badges
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
            case 'In Progress': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
            case 'Resolved': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
            case 'Cancelled': return 'bg-slate-50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-500/20';
            default: return 'bg-slate-50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-500/20';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'Urgent': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.15)] animate-pulse';
            case 'High': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20';
            case 'Medium': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
            case 'Low': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
            default: return 'bg-slate-50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-500/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 relative pb-20">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-20 w-96 h-96 bg-[#5b21b6]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute top-40 left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Maintenance Requests</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2">Manage tenant maintenance issues and track resolutions.</p>
                </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 relative z-10">
                <div className="relative group flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 dark:text-zinc-500">
                        <svg className="w-5 h-5 group-focus-within:text-[#5b21b6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search tenant or issue..." 
                        className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <select 
                    className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all appearance-none outline-none sm:w-40"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <select 
                    className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all appearance-none outline-none sm:w-40"
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                >
                    <option value="All">All Priorities</option>
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                </select>

                <select 
                    className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all appearance-none outline-none sm:w-40"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Main Table */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative z-10 min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="w-8 h-8 border-4 border-[#5b21b6]/20 border-t-[#5b21b6] rounded-full animate-spin"></div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Loading Requests...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-zinc-900/50">
                                <tr className="border-b border-slate-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-slate-500 dark:text-zinc-500 font-black">
                                    <th className="px-8 py-5">ID</th>
                                    <th className="px-8 py-5">Tenant Info</th>
                                    <th className="px-8 py-5">Issue</th>
                                    <th className="px-8 py-5">Category</th>
                                    <th className="px-8 py-5">Priority</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Date Reported</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50 text-sm">
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-indigo-50/50 dark:hover:bg-zinc-900/40 transition-colors group">
                                        <td className="px-8 py-5 font-bold text-slate-500 dark:text-zinc-500">#{req.id}</td>
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">{req.tenant_name}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-black uppercase tracking-wider mt-0.5">Rm {req.room_number || 'N/A'}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-slate-700 dark:text-zinc-300 max-w-[200px] truncate">{req.title}</div>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-500 dark:text-zinc-500 text-[10px] uppercase tracking-wider">{req.category}</td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-block px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border ${getPriorityStyle(req.priority)}`}>
                                                {req.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-block px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border ${getStatusStyle(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-slate-500 dark:text-zinc-400 font-bold text-xs tracking-wide">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => setViewModalReq(req)}
                                                    className="p-2 text-slate-500 dark:text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="View Details"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                </button>
                                                <button 
                                                    onClick={() => openUpdateModal(req)}
                                                    className="p-2 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-400/10 rounded-lg transition-colors" title="Update Request"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-16 text-center">
                                            <div className="text-slate-500 dark:text-zinc-500 font-bold tracking-tight text-lg mb-1">No requests found</div>
                                            <p className="text-zinc-600 text-xs font-medium">Try adjusting your search or filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {viewModalReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        <div className="p-8 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
                                    Request #{viewModalReq.id}
                                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border ${getStatusStyle(viewModalReq.status)}`}>
                                        {viewModalReq.status}
                                    </span>
                                </h3>
                            </div>
                            <button onClick={() => setViewModalReq(null)} className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar w-full">
                            <div className="grid grid-cols-2 text-sm gap-6">
                                <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                                    <div className="text-slate-500 dark:text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        Tenant
                                    </div>
                                    <div className="font-black text-slate-900 dark:text-white text-lg">{viewModalReq.tenant_name}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                                    <div className="text-slate-500 dark:text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                        Room Number
                                    </div>
                                    <div className="font-black text-slate-900 dark:text-white text-lg">{viewModalReq.room_number || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 text-sm gap-6">
                                <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                                    <div className="text-slate-500 dark:text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-2">Date Reported</div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">{new Date(viewModalReq.created_at).toLocaleDateString()}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                                    <div className="text-slate-500 dark:text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-2">Category</div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">{viewModalReq.category}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                                    <div className="text-slate-500 dark:text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-2">Priority</div>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border ${getPriorityStyle(viewModalReq.priority)}`}>
                                        {viewModalReq.priority}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-3">Issue Description</h4>
                                <div className="bg-slate-50 dark:bg-zinc-900/30 p-6 rounded-3xl text-slate-700 dark:text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-zinc-800 border-dashed">
                                    <strong className="text-slate-900 dark:text-white block mb-3 text-lg font-black">{viewModalReq.title}</strong>
                                    {viewModalReq.description}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-3">Assigned Staff</h4>
                                    <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-2xl text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-zinc-800 font-bold">
                                        {viewModalReq.assigned_to || <span className="text-slate-400 dark:text-zinc-600 font-medium italic">Not assigned yet</span>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-3">Scheduling</h4>
                                    <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-2xl text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-zinc-800 font-medium space-y-2">
                                        <div><span className="text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest text-[9px] mr-2">Scheduled:</span> {viewModalReq.scheduled_date ? new Date(viewModalReq.scheduled_date).toLocaleDateString() : <span className="text-slate-400 italic">Not set</span>}</div>
                                        <div><span className="text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest text-[9px] mr-2">Resolved:</span> {viewModalReq.date_resolved ? new Date(viewModalReq.date_resolved).toLocaleDateString() : <span className="text-slate-400 italic">Not set</span>}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-3">Admin Notes</h4>
                                <div className="bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-2xl text-slate-700 dark:text-zinc-300 text-sm border border-slate-200 dark:border-zinc-800 font-medium leading-relaxed">
                                    {viewModalReq.admin_notes || <span className="text-slate-400 dark:text-zinc-600 italic">No notes</span>}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex justify-end gap-3">
                            <button onClick={() => setViewModalReq(null)} className="px-6 py-3.5 font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-colors shadow-sm">
                                Close
                            </button>
                            <button 
                                onClick={() => {
                                    const req = viewModalReq;
                                    setViewModalReq(null);
                                    openUpdateModal(req);
                                }} 
                                className="px-6 py-3.5 bg-[#5b21b6] text-white font-bold rounded-xl hover:bg-[#4c1d95] shadow-[0_0_20px_rgba(91,33,182,0.4)] transition-all tracking-wide flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {updateModalReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Update Request</h3>
                            <button onClick={() => setUpdateModalReq(null)} className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="p-8 flex flex-col gap-6">
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Status</label>
                                    <select 
                                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-bold transition-colors appearance-none"
                                        value={updateStatus}
                                        onChange={(e) => setUpdateStatus(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Priority</label>
                                    <select 
                                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-bold transition-colors appearance-none"
                                        value={updatePriority}
                                        onChange={(e) => setUpdatePriority(e.target.value)}
                                    >
                                        <option value="Urgent">Urgent</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                        <option value="Normal">Normal</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Assigned Staff</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. John Doe (Plumber)"
                                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-bold transition-colors placeholder:text-zinc-600 placeholder:font-medium"
                                    value={updateAssigned}
                                    onChange={(e) => setUpdateAssigned(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Scheduled Date</label>
                                    <input 
                                        type="date"
                                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-bold transition-colors [color-scheme:light_dark]"
                                        value={updateScheduledDate}
                                        onChange={(e) => setUpdateScheduledDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Date Resolved</label>
                                    <input 
                                        type="date"
                                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-bold transition-colors [color-scheme:light_dark]"
                                        value={updateDateResolved}
                                        onChange={(e) => setUpdateDateResolved(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Admin Notes</label>
                                <textarea 
                                    rows={4}
                                    placeholder="Add any internal notes, spare parts used, or resolution details here..."
                                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-medium transition-colors resize-none placeholder:text-zinc-600 custom-scrollbar"
                                    value={updateNotes}
                                    onChange={(e) => setUpdateNotes(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-zinc-800">
                                <button 
                                    type="button" 
                                    onClick={() => setUpdateModalReq(null)}
                                    className="px-6 py-3.5 text-slate-500 dark:text-zinc-400 font-bold hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isUpdating}
                                    className="px-6 py-3.5 bg-[#5b21b6] text-white font-bold rounded-xl hover:bg-[#4c1d95] shadow-[0_0_20px_rgba(91,33,182,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isUpdating ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}