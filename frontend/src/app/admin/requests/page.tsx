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
                admin_notes: updateNotes
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

    // Helper functions for badges
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Cancelled': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'Urgent': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Requests</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage tenant maintenance issues and track resolutions.</p>
                </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row gap-4">
                <input 
                    type="text" 
                    placeholder="Search tenant or issue..." 
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-slate-700 placeholder-slate-400"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                
                <select 
                    className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-700"
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
                    className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-700"
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
                    className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-700"
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
            <div className="bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500 font-black">
                                    <th className="p-5">ID</th>
                                    <th className="p-5">Tenant Info</th>
                                    <th className="p-5">Issue</th>
                                    <th className="p-5">Category</th>
                                    <th className="p-5">Priority</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5">Date Reported</th>
                                    <th className="p-5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-5 font-bold text-slate-400">#{req.id}</td>
                                        <td className="p-5">
                                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{req.tenant_name}</div>
                                            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Room {req.room_number || 'N/A'}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-slate-700 max-w-[200px] truncate">{req.title}</div>
                                        </td>
                                        <td className="p-5 font-bold text-slate-500 text-[11px] uppercase tracking-wider">{req.category}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${getPriorityStyle(req.priority)}`}>
                                                {req.priority}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${getStatusStyle(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-slate-500 font-bold text-xs tracking-wide">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => setViewModalReq(req)}
                                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] tracking-wider uppercase transition-colors"
                                                >
                                                    View
                                                </button>
                                                <button 
                                                    onClick={() => openUpdateModal(req)}
                                                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-[11px] tracking-wider uppercase transition-colors"
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-16 text-center">
                                            <div className="text-slate-400 font-bold tracking-tight text-lg">No requests found</div>
                                            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200/50">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    Request #{viewModalReq.id}
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border ${getStatusStyle(viewModalReq.status)}`}>
                                        {viewModalReq.status}
                                    </span>
                                </h3>
                            </div>
                            <button onClick={() => setViewModalReq(null)} className="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-200/50">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 text-sm gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1.5">Tenant</div>
                                    <div className="font-bold text-slate-900">{viewModalReq.tenant_name}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1.5">Room Number</div>
                                    <div className="font-bold text-slate-900">{viewModalReq.room_number || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 text-sm gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1.5">Date Reported</div>
                                    <div className="font-bold text-slate-900 text-xs tracking-wide">{new Date(viewModalReq.created_at).toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1.5">Category</div>
                                    <div className="font-bold text-slate-900">{viewModalReq.category}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1.5">Priority</div>
                                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${getPriorityStyle(viewModalReq.priority)}`}>
                                        {viewModalReq.priority}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Issue Description</h4>
                                <div className="bg-slate-50 p-5 rounded-3xl text-slate-700 text-sm whitespace-pre-wrap leading-relaxed border border-slate-100">
                                    <strong className="text-slate-900 block mb-2 text-base font-black">{viewModalReq.title}</strong>
                                    {viewModalReq.description}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Assigned Staff</h4>
                                    <div className="bg-slate-50 p-4 rounded-2xl text-slate-700 text-sm border border-slate-100 font-bold">
                                        {viewModalReq.assigned_to || <span className="text-slate-400 font-medium italic">Not assigned yet</span>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Admin Notes</h4>
                                    <div className="bg-slate-50 p-4 rounded-2xl text-slate-700 text-sm border border-slate-100 font-medium leading-relaxed">
                                        {viewModalReq.admin_notes || <span className="text-slate-400 italic">No notes</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button 
                                onClick={() => {
                                    const req = viewModalReq;
                                    setViewModalReq(null);
                                    openUpdateModal(req);
                                }} 
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-200 transition-all text-sm tracking-wide"
                            >
                                Edit / Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {updateModalReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200/50">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Update Request #{updateModalReq.id}</h3>
                            <button onClick={() => setUpdateModalReq(null)} className="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-200/50">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="p-6 flex flex-col gap-6">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                                    <select 
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-colors shadow-sm"
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
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
                                    <select 
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-700 transition-colors shadow-sm"
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
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Staff</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. John Doe (Plumber)"
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-900 transition-colors shadow-sm placeholder:text-slate-400 placeholder:font-medium"
                                    value={updateAssigned}
                                    onChange={(e) => setUpdateAssigned(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Notes</label>
                                <textarea 
                                    rows={4}
                                    placeholder="Add any internal notes, spare parts used, or resolution details here..."
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-medium text-slate-700 transition-colors resize-none shadow-sm placeholder:text-slate-400"
                                    value={updateNotes}
                                    onChange={(e) => setUpdateNotes(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setUpdateModalReq(null)}
                                    className="px-5 py-3 text-slate-500 font-bold hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isUpdating}
                                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 text-sm tracking-wide"
                                >
                                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}