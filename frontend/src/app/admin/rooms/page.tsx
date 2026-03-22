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
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Room Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Live from PostgreSQL database.</p>
                </div>
                <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    Add New Room
                </button>
            </div>

            {isLoading ? (
                <div className="p-8 font-bold text-slate-500 animate-pulse">Loading rooms...</div>
            ) : rooms.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/60">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No rooms found</h3>
                    <p className="text-slate-500">You haven't added any rooms to the database yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl">
                                    {room.room_number}
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                    room.status === 'available' ? 'bg-green-100 text-green-700' : 
                                    room.status === 'occupied' ? 'bg-blue-100 text-blue-700' : 
                                    'bg-orange-100 text-orange-700'
                                }`}>
                                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                                </span>
                            </div>
                            <div className="space-y-2 mb-6 flex-1">
                                <p className="text-sm font-medium text-slate-500 flex justify-between">
                                    Capacity: <span className="font-bold text-slate-900">{room.capacity} Person(s)</span>
                                </p>
                                <p className="text-sm font-medium text-slate-500 flex justify-between">
                                    Rent: <span className="font-bold text-slate-900">₱ {Number(room.price).toLocaleString()}/mo</span>
                                </p>
                                {room.tenant_name && (
                                    <p className="text-sm font-medium text-slate-500 flex justify-between">
                                        Tenant: <span className="font-bold text-slate-900">{room.tenant_name}</span>
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors">Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}