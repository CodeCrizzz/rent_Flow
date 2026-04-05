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
                status: 'Available' 
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

    const distinctFloors = Array.from(new Set(rooms.map(r => r.floor).filter(Boolean)));

    const filteredRooms = rooms.filter(r => 
        (statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase()) &&
        (typeFilter === 'All' || r.type === typeFilter) &&
        (floorFilter === 'All' || r.floor === floorFilter) &&
        (r.room_number.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getRoomStatusStyles = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
            case 'Partial': return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20';
            case 'Occupied': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
            case 'Maintenance': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
            default: return 'bg-slate-50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-500/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 relative pb-20">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-20 w-96 h-96 bg-[#5b21b6]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Room Management</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2">Manage properties, capacities, and monitor availability.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()} 
                    className="px-6 py-3.5 bg-[#5b21b6] text-slate-900 dark:text-white font-bold rounded-xl hover:bg-[#4c1d95] transition-all shadow-[0_0_20px_rgba(91,33,182,0.4)] text-sm flex items-center justify-center gap-2 group w-full sm:w-auto"
                >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    Add New Room
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 font-bold text-sm flex items-center gap-3 relative z-10">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <div className="relative group flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 dark:text-zinc-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search by Room Number..." 
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all" 
                    />
                </div>
                
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-3.5 px-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all appearance-none outline-none sm:w-40">
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Partial">Partial</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                </select>

                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="py-3.5 px-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all appearance-none outline-none sm:w-40">
                    <option value="All">All Types</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Bedspace">Bedspace</option>
                </select>
                
                {distinctFloors.length > 0 && (
                <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className="py-3.5 px-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all appearance-none outline-none sm:w-40">
                    <option value="All">All Floors</option>
                    {distinctFloors.map((f, i) => <option key={i} value={f as string}>{f}</option>)}
                </select>
                )}
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative z-10">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-zinc-900/50">
                            <tr className="border-b border-slate-200 dark:border-zinc-800">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Room Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Occupancy</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Financials</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="w-6 h-6 border-2 border-[#5b21b6]/20 border-t-[#5b21b6] rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Fetching rooms...</p>
                                    </td>
                                </tr>
                            ) : filteredRooms.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-500 dark:text-zinc-500 font-bold text-sm">No rooms found.</td></tr>
                            ) : (
                                filteredRooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-indigo-50/50 dark:hover:bg-zinc-900/40 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 flex items-center justify-center font-black text-sm group-hover:bg-[#5b21b6] group-hover:text-white group-hover:border-[#5b21b6] transition-all duration-300 shrink-0">
                                                    {room.room_number}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{room.type}</p>
                                                    <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">Floor {room.floor || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm">{room.current_occupants} / {room.capacity} Residents</p>
                                            <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase tracking-widest">{room.available_slots} Slots Available</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-emerald-400 text-sm">₱ {Number(room.price).toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">Per Month</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border ${getRoomStatusStyles(room.status)}`}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleViewRoom(room)} className="p-2 text-slate-500 dark:text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="View Details">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                </button>
                                                <button onClick={() => handleOpenModal(room)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" title="Edit Room">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={() => handleDelete(room.id)} disabled={room.current_occupants > 0 || isDeleting === room.id} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent" title="Delete Room">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-white dark:bg-[#0a0a0a] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Room Number</label>
                                    <input required type="text" value={formData.room_number} onChange={e => setFormData({...formData, room_number: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" placeholder="e.g. 101" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none appearance-none">
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Bedspace">Bedspace</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Capacity</label>
                                    <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Monthly Price (₱)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Floor (Optional)</label>
                                    <input type="text" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" placeholder="e.g. 1st Floor" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Status Override</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none appearance-none">
                                        <option value="Available">Available</option>
                                        <option value="Partial">Partial</option>
                                        <option value="Occupied">Occupied</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Description (Optional)</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none resize-none h-24 custom-scrollbar" placeholder="Room details, amenities, etc."></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-zinc-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:text-white rounded-xl transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-3.5 font-bold bg-[#5b21b6] text-white rounded-xl hover:bg-[#4c1d95] transition-colors shadow-lg flex items-center justify-center gap-2">
                                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : (editingRoom ? 'Update Room' : 'Register Room')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewModalOpen && viewingRoom && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Room {viewingRoom.room_number}</h2>
                                <p className="text-slate-500 dark:text-zinc-500 font-medium text-sm mt-1">{viewingRoom.type} • Floor {viewingRoom.floor || 'N/A'}</p>
                            </div>
                            <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border ${getRoomStatusStyles(viewingRoom.status)}`}>
                                {viewingRoom.status}
                            </span>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar w-full">
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-2">Monthly Rent</p>
                                    <p className="text-2xl font-black text-emerald-400">₱{Number(viewingRoom.price).toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-2">Capacity</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{viewingRoom.capacity} <span className="text-sm text-slate-500 dark:text-zinc-500 font-bold">People</span></p>
                                </div>
                                <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Available Slots</p>
                                    <p className="text-2xl font-black text-indigo-400">{viewingRoom.available_slots}</p>
                                </div>
                            </div>
                            
                            {viewingRoom.description && (
                                <div className="mb-8">
                                    <h3 className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Room Description
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 border-dashed p-5 rounded-2xl">{viewingRoom.description}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-4 flex justify-between items-center">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        Current Residents ({viewingRoom.current_occupants})
                                    </span>
                                </h3>
                                
                                {viewingRoom.occupants.length === 0 ? (
                                    <div className="text-center py-8 bg-slate-50 dark:bg-zinc-900/30 rounded-2xl border border-slate-200 dark:border-zinc-800 border-dashed">
                                        <p className="text-sm font-bold text-slate-500 dark:text-zinc-500">No active residents in this room.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {viewingRoom.occupants.map(tenant => (
                                            <div key={tenant.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 hover:bg-slate-200 dark:hover:bg-slate-200 dark:hover:bg-zinc-800/80 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400 font-bold text-xs border border-slate-300 dark:border-zinc-700">
                                                        {tenant.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{tenant.name}</p>
                                                        <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5">{tenant.phone} • {tenant.date_moved_in ? new Date(tenant.date_moved_in).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border ${
                                                        tenant.balance > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
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
                        <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex justify-end">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-3.5 font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 rounded-xl transition-colors shadow-sm">
                                Close Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}