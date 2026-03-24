"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/admin/requests');
                setRequests(data);
            } catch (error) {
                console.error("Failed to fetch requests:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Maintenance Requests</h1>
                <p className="text-slate-500 font-medium mt-2">Manage and resolve reported resident issues.</p>
            </div>

            {isLoading ? (
                <div className="p-12 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 font-bold text-slate-400 text-sm">Loading tickets...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-4xl border border-slate-200/50 shadow-sm font-bold text-slate-400">No maintenance requests found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {requests.map(req => (
                        <div key={req.id} className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 flex flex-col hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)] transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border ${req.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                    {req.status}
                                </span>
                                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">{new Date(req.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{req.title}</h3>
                            <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">{req.description}</p>
                            
                            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assigned To</p>
                                    <p className="font-bold text-slate-900">Room {req.room_number || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tenant</p>
                                    <p className="font-bold text-slate-700 text-sm">{req.tenant_name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}