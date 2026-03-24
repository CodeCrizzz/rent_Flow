"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Room {
    id: number;
    room_number: string;
    capacity: number;
    price: string;
    status: string;
    tenant_name: string | null;
}

export default function AdminRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await api.get('/admin/rooms');
                setRooms(data);
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRooms();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Room Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Oversee holdings and property availability.</p>
                </div>
                <button className="px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 text-sm flex items-center gap-2 group">
                    <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    Add New Room
                </button>
            </div>

            {isLoading ? (
                <div className="p-12 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 font-bold text-slate-400 text-sm">Synchronizing database...</p>
                </div>
            ) : rooms.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-4xl border border-slate-200/50 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No rooms found</h3>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto">You haven't added any rooms to the database yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 flex flex-col hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)] transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                                    {room.room_number}
                                </div>
                                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border ${
                                    room.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                    room.status === 'occupied' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                    'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {room.status}
                                </span>
                            </div>
                            <div className="space-y-4 mb-8 flex-1">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Capacity</span>
                                    <span className="font-black text-slate-900">{room.capacity} Person(s)</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Monthly Rent</span>
                                    <span className="font-black text-indigo-600">₱ {Number(room.price).toLocaleString()}</span>
                                </div>
                                {room.tenant_name && (
                                    <div className="pt-4 mt-4 border-t border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resident</p>
                                        <p className="font-bold text-slate-900">{room.tenant_name}</p>
                                    </div>
                                )}
                            </div>
                            <button className="w-full py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all">
                                Edit Configuration
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}