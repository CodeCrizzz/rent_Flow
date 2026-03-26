"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Tenant {
    id: number;
    name: string;
    phone: string;
    date_moved_in: string;
    balance: number;
}

interface Room {
    id: number;
    room_number: string;
    type: string;
    capacity: number;
    price: string;
    floor: string | null;
    description: string | null;
    status: string;
    available_slots: number;
    occupants: Tenant[];
    current_occupants: number;
}

export default function AdminRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    
    // Target items
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [viewingRoom, setViewingRoom] = useState<Room | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [floorFilter, setFloorFilter] = useState('All');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        room_number: '',
        type: 'Single',
        capacity: 1,
        price: '',
        floor: '',
        description: '',
        status: 'Available'
    });

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/admin/rooms');
            setRooms(data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
            setError("Failed to load rooms.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleOpenModal = (room?: Room) => {
        if (room) {
            setEditingRoom(room);
            setFormData({
                room_number: room.room_number,
                type: room.type || 'Single',
                capacity: room.capacity,
                price: room.price,
                floor: room.floor || '',
                description: room.description || '',
                status: room.status || 'Available'
            });
        } else {
            setEditingRoom(null);
            setFormData({
                room_number: '',
                type: 'Single',
                capacity: 1,
                price: '',
                floor: '',
                description: '',
                status: 'Available' // Default Status
            });
        }
        setIsModalOpen(true);
    };

    const handleViewRoom = (room: Room) => {
        setViewingRoom(room);
        setIsViewModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            if (editingRoom) {
                await api.put(`/admin/rooms/${editingRoom.id}`, formData);
            } else {
                await api.post('/admin/rooms', formData);
            }
            setIsModalOpen(false);
            fetchRooms();
        } catch (err: any) {
            console.error("Operation failed:", err);
            setError(err.response?.data?.message || "Operation failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this room? Action cannot be undone.")) return;
        setIsDeleting(id);
        setError('');
        try {
            await api.delete(`/admin/rooms/${id}`);
            fetchRooms();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete room. Please check active residents.");
        } finally {
            setIsDeleting(null);
        }
    };

    // Derived distinct floors for filter
    const distinctFloors = Array.from(new Set(rooms.map(r => r.floor).filter(Boolean)));

    const filteredRooms = rooms.filter(r => 
        (statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase()) &&
        (typeFilter === 'All' || r.type === typeFilter) &&
        (floorFilter === 'All' || r.floor === floorFilter) &&
        (r.room_number.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Room Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage properties, capacities, and monitor availability.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 text-sm flex items-center gap-2 group w-full sm:w-auto">
                    <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    Add New Room
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative group flex-1">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Room Number..." className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 w-full shadow-sm outline-none transition-all" />
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-3.5 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 border-none shadow-sm outline-none">
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Partial">Partial</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                </select>

                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="py-3.5 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none shadow-sm outline-none">
                    <option value="All">All Types</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Bedspace">Bedspace</option>
                </select>
                
                {distinctFloors.length > 0 && (
                <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className="py-3.5 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none shadow-sm outline-none">
                    <option value="All">All Floors</option>
                    {distinctFloors.map((f, i) => <option key={i} value={f as string}>{f}</option>)}
                </select>
                )}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Info</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupancy</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financials</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-8 py-16 text-center"><div className="inline-block w-6 h-6 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div><p className="mt-3 font-bold text-slate-400 text-xs">Fetching rooms...</p></td></tr>
                            ) : filteredRooms.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold text-sm">No rooms found.</td></tr>
                            ) : (
                                filteredRooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
                                                    {room.room_number}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{room.type}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Floor {room.floor || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="font-bold text-slate-900 text-sm">{room.current_occupants} / {room.capacity} Residents</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{room.available_slots} Slots Available</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="font-bold text-indigo-600 text-sm">₱{Number(room.price).toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Per Month</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border ${
                                                room.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                room.status === 'Partial' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                room.status === 'Occupied' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleViewRoom(room)} className="px-4 py-2 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 rounded-lg transition-colors">
                                                    View
                                                </button>
                                                <button onClick={() => handleOpenModal(room)} className="px-4 py-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 rounded-lg transition-colors">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(room.id)} disabled={room.current_occupants > 0 || isDeleting === room.id} className="px-4 py-2 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                                                    {isDeleting === room.id ? '...' : 'Del'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Room Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Room Number</label>
                                    <input required type="text" value={formData.room_number} onChange={e => setFormData({...formData, room_number: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none" placeholder="e.g. 101" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none appearance-none">
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Bedspace">Bedspace</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Capacity</label>
                                    <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Monthly Price (₱)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Floor (Optional)</label>
                                    <input type="text" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none" placeholder="e.g. 1st Floor" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Status Override</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none appearance-none">
                                        <option value="Available">Available</option>
                                        <option value="Partial">Partial</option>
                                        <option value="Occupied">Occupied</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description (Optional)</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none resize-none h-24" placeholder="Room details, amenities, etc."></textarea>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-6">
                                {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : (editingRoom ? 'Update Room Detail' : 'Register Room')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewModalOpen && viewingRoom && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-4xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900">Room {viewingRoom.room_number}</h2>
                                <p className="text-slate-500 font-medium text-sm mt-1">{viewingRoom.type} • Floor {viewingRoom.floor || 'N/A'}</p>
                            </div>
                            <span className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl border ${
                                viewingRoom.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                viewingRoom.status === 'Partial' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                viewingRoom.status === 'Occupied' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                                {viewingRoom.status}
                            </span>
                        </div>
                        
                        <div className="p-8 overflow-y-auto w-full">
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rent</p>
                                    <p className="font-black text-slate-900">₱{Number(viewingRoom.price).toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                                    <p className="font-black text-slate-900">{viewingRoom.capacity} People</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Slots</p>
                                    <p className="font-black text-indigo-600">{viewingRoom.available_slots}</p>
                                </div>
                            </div>
                            
                            {viewingRoom.description && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Room Description</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl">{viewingRoom.description}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex justify-between items-center">
                                    <span>Current Residents ({viewingRoom.current_occupants})</span>
                                </h3>
                                
                                {viewingRoom.occupants.length === 0 ? (
                                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                        <p className="text-sm font-bold text-slate-400">No active residents in this room.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {viewingRoom.occupants.map(tenant => (
                                            <div key={tenant.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors bg-white">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                        {tenant.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{tenant.name}</p>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">{tenant.phone} • {tenant.date_moved_in ? new Date(tenant.date_moved_in).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${
                                                        tenant.balance > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                        {tenant.balance > 0 ? `Owes ₱${tenant.balance}` : 'Clear'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-3 bg-white text-slate-700 font-bold text-sm tracking-wide rounded-xl border border-slate-200 hover:bg-slate-100 transition-all shadow-sm">
                                Close Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}