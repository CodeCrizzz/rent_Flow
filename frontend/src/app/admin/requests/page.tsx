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
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Requests</h1>
            {isLoading ? (
                <div className="font-bold text-slate-500 animate-pulse">Loading requests...</div>
            ) : requests.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/60 font-bold text-slate-500">No maintenance requests found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(req => (
                        <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${req.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{req.status}</span>
                                <span className="text-sm font-medium text-slate-400">{new Date(req.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{req.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{req.description}</p>
                            <div className="mt-auto pt-4 border-t border-slate-100 text-sm">
                                <p className="font-bold text-slate-900">Room {req.room_number || 'N/A'}</p>
                                <p className="text-slate-500">{req.tenant_name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}