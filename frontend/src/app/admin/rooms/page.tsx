"use client";
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface Tenant {
    id: number;
    name: string;
    phone: string;
    date_moved_in: string;
    balance: number;
}

interface Tenant { id: number; name: string; }

interface Room {
    id: number;
    room_number: string;
    type: string;
    price: string;
    floor: string | null;
    description: string | null;
    capacity: number;
    current_occupants: number;
    available_slots: number;
    status: string;
    occupants: Tenant[];
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
            case 'Available': return {
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                text: 'text-emerald-700 dark:text-emerald-400',
                border: 'border-emerald-200 dark:border-emerald-500/20',
                glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
                dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
            };
            case 'Partial': return {
                bg: 'bg-indigo-50 dark:bg-indigo-500/10',
                text: 'text-indigo-700 dark:text-indigo-400',
                border: 'border-indigo-200 dark:border-indigo-500/20',
                glow: 'shadow-[0_0_15px_rgba(99,102,241,0.3)]',
                dot: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]'
            };
            case 'Occupied': return {
                bg: 'bg-amber-50 dark:bg-amber-500/10',
                text: 'text-amber-700 dark:text-amber-400',
                border: 'border-amber-200 dark:border-amber-500/20',
                glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
                dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
            };
            case 'Maintenance': return {
                bg: 'bg-rose-50 dark:bg-rose-500/10',
                text: 'text-rose-700 dark:text-rose-400',
                border: 'border-rose-200 dark:border-rose-500/20',
                glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
                dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
            };
            default: return {
                bg: 'bg-slate-50 dark:bg-zinc-500/10',
                text: 'text-slate-600 dark:text-zinc-400',
                border: 'border-slate-200 dark:border-zinc-500/20',
                glow: '',
                dot: 'bg-slate-500'
            };
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10 relative">
            {/* Ambient Background */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/5 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen dark:mix-blend-lighten"></div>

            <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10 mb-8">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Properties</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-[0.2em] mt-2">Manage & Monitor Availability</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()} 
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] text-xs flex items-center justify-center gap-3 group w-full sm:w-auto"
                >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    Add Property
                </button>
            </motion.div>

            {error && (
                <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 font-bold text-sm flex items-center gap-3 relative z-10 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                    {error}
                </motion.div>
            )}

            {/* Filters */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="flex flex-col xl:flex-row gap-4 relative z-10 mb-8 bg-white dark:bg-black backdrop-blur-2xl p-4 rounded-[2rem] border border-slate-200/60 dark:border-zinc-800/60 shadow-xl dark:shadow-2xl">
                <div className="relative group flex-1">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search by Room Number..." 
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-zinc-500 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner" 
                    />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 xl:flex gap-4">
                    <div className="relative">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full xl:w-48 py-4 pl-5 pr-10 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                            <option value="All">All Statuses</option>
                            <option value="Available">Available</option>
                            <option value="Partial">Partial</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <div className="relative">
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full xl:w-48 py-4 pl-5 pr-10 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                            <option value="All">All Types</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Bedspace">Bedspace</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    
                    {distinctFloors.length > 0 && (
                        <div className="relative col-span-2 md:col-span-1">
                            <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className="w-full xl:w-48 py-4 pl-5 pr-10 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                                <option value="All">All Floors</option>
                                {distinctFloors.map((f, i) => <option key={i} value={f as string}>{f}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Property Cards Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="relative flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-slate-200 dark:border-zinc-800 border-t-blue-500 dark:border-t-blue-500 rounded-full animate-spin relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.3)]"></div>
                        <p className="text-slate-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-[0.2em] mt-6 animate-pulse">Loading Properties...</p>
                    </div>
                </div>
            ) : filteredRooms.length === 0 ? (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white dark:bg-black backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 p-16 text-center shadow-2xl">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-200 dark:border-zinc-800">
                        <svg className="w-10 h-10 text-slate-400 dark:text-zinc-500 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5s0 0 0 0m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No properties found</h3>
                    <p className="text-sm font-bold text-slate-500 dark:text-zinc-500">Try adjusting your search or filters.</p>
                </motion.div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRooms.map((room) => {
                        const style = getRoomStatusStyles(room.status);
                        
                        return (
                            <motion.div key={room.id} variants={itemVariants} className="relative group rounded-3xl p-[1px] overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent hover:shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-shadow duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                                <div className="h-full w-full bg-white dark:bg-black backdrop-blur-3xl rounded-[23px] p-6 flex flex-col relative overflow-hidden transition-transform duration-500 group-hover:scale-[0.99]">
                                    
                                    {/* Top Row: Room # and Status */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border ${style.bg} ${style.text} ${style.border}`}>
                                                {room.room_number}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-lg">{room.type}</p>
                                                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Floor {room.floor || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md ${style.border}`}>
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${style.dot}`}></div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${style.text}`}>{room.status}</span>
                                        </div>
                                    </div>

                                    {/* Occupancy Progress */}
                                    <div className="mb-6 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Occupancy</span>
                                            <span className="font-black text-slate-900 dark:text-white text-sm">{room.current_occupants} / {room.capacity}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                                            <div style={{width: `${(room.current_occupants / Math.max(room.capacity, 1)) * 100}%`}} className={`h-full rounded-full transition-all duration-1000 ${room.current_occupants === room.capacity ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'}`}></div>
                                        </div>
                                        <p className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-2">{room.available_slots} Slots Available</p>
                                    </div>

                                    {/* Financials & Residents Preview */}
                                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-200 dark:border-zinc-800/80">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-1">Monthly Rent</p>
                                            <p className="font-black text-emerald-500 dark:text-emerald-400 text-xl tracking-tight">₱{Number(room.price).toLocaleString()}</p>
                                        </div>
                                        
                                        {/* Avatar stack for residents */}
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {room.occupants.slice(0, 3).map((tenant, idx) => (
                                                <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#0a0a0a] bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-black text-white shadow-md">
                                                    {tenant.name.charAt(0)}
                                                </div>
                                            ))}
                                            {room.occupants.length > 3 && (
                                                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#0a0a0a] bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-zinc-400 border border-slate-300 dark:border-zinc-600 shadow-md">
                                                    +{room.occupants.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Hover Overlay */}
                                    <div className="absolute inset-0 bg-white/60 dark:bg-[#0a0a0a]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                        <button onClick={() => handleViewRoom(room)} className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-xl flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-blue-500 hover:border-blue-500 transition-colors hover:scale-110 active:scale-95" title="View Details">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        </button>
                                        <button onClick={() => handleOpenModal(room)} className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-xl flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-indigo-500 hover:border-indigo-500 transition-colors hover:scale-110 active:scale-95" title="Edit Room">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button onClick={() => handleDelete(room.id)} disabled={room.current_occupants > 0 || isDeleting === room.id} className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-xl flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-rose-500 hover:border-rose-500 transition-colors hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:text-slate-700 disabled:hover:border-slate-200 cursor-not-allowed" title="Delete Room">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>

                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Modals with Framer Motion */}
            <AnimatePresence>
            {isModalOpen && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{scale:0.9, y:20, opacity:0}} animate={{scale:1, y:0, opacity:1}} exit={{scale:0.95, y:10, opacity:0}} transition={{type: "spring", damping: 25, stiffness: 300}} className="bg-linear-to-br from-white/80 to-slate-50/50 dark:from-[#0a0a0a]/80 dark:to-transparent backdrop-blur-3xl rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-zinc-800">
                        <div className="px-8 py-6 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{editingRoom ? 'Edit Property' : 'New Property'}</h2>
                                <p className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest mt-1">Configure Room Details</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Room Number <span className="text-rose-500">*</span></label>
                                    <input required type="text" value={formData.room_number} onChange={e => setFormData({...formData, room_number: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner" placeholder="e.g. 101" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Type <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all shadow-inner cursor-pointer">
                                            <option value="Single">Single Room</option>
                                            <option value="Double">Double Room</option>
                                            <option value="Bedspace">Bedspace</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Max Capacity <span className="text-rose-500">*</span></label>
                                    <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Monthly Price (₱) <span className="text-rose-500">*</span></label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-inner" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Floor (Optional)</label>
                                    <input type="text" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner" placeholder="e.g. 1st Floor" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Status Override</label>
                                    <div className="relative">
                                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all shadow-inner cursor-pointer">
                                            <option value="Available">Available</option>
                                            <option value="Partial">Partial</option>
                                            <option value="Occupied">Occupied</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Description (Optional)</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-32 custom-scrollbar transition-all shadow-inner" placeholder="Room details, amenities, etc."></textarea>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200 dark:border-zinc-800/80">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-8 py-4 font-black text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-2xl transition-all uppercase tracking-widest text-xs">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-4 font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-70">
                                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : (editingRoom ? 'Save Changes' : 'Create Room')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            {isViewModalOpen && viewingRoom && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{scale:0.9, y:20, opacity:0}} animate={{scale:1, y:0, opacity:1}} exit={{scale:0.95, y:10, opacity:0}} transition={{type: "spring", damping: 25, stiffness: 300}} className="bg-linear-to-br from-white/80 to-slate-50/50 dark:from-[#0a0a0a]/80 dark:to-transparent backdrop-blur-3xl rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex justify-between items-start gap-4">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                                    {viewingRoom.room_number}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{viewingRoom.type}</h2>
                                    <p className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest mt-1">Floor {viewingRoom.floor || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {(() => {
                                    const style = getRoomStatusStyles(viewingRoom.status);
                                    return (
                                        <span className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl border flex items-center gap-2 shadow-sm ${style.bg} ${style.border} ${style.text}`}>
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${style.dot}`}></div>
                                            {viewingRoom.status}
                                        </span>
                                    );
                                })()}
                                <button onClick={() => setIsViewModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                                <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl shadow-inner relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 text-xl shadow-sm border border-emerald-200 dark:border-emerald-500/20">💰</div>
                                    <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-1">Monthly Rent</p>
                                    <p className="text-3xl font-black text-emerald-500 dark:text-emerald-400 tracking-tighter">₱{Number(viewingRoom.price).toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl shadow-inner relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 text-xl shadow-sm border border-blue-200 dark:border-blue-500/20">👥</div>
                                    <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-1">Capacity</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{viewingRoom.capacity} <span className="text-sm text-slate-500 dark:text-zinc-500">Max</span></p>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 p-6 rounded-3xl shadow-[0_0_15px_rgba(99,102,241,0.1)] relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-4 text-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">✨</div>
                                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Available Slots</p>
                                    <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{viewingRoom.available_slots}</p>
                                </div>
                            </div>
                            
                            {viewingRoom.description && (
                                <div className="mb-10">
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
                                        Description
                                    </h3>
                                    <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl shadow-inner">
                                        <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">{viewingRoom.description}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></span>
                                        Current Residents
                                    </h3>
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-zinc-700">{viewingRoom.current_occupants} Total</span>
                                </div>
                                
                                {viewingRoom.occupants.length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-inner">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 flex items-center justify-center text-2xl mx-auto mb-4 grayscale opacity-50">👻</div>
                                        <p className="text-sm font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">No active residents</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {viewingRoom.occupants.map(tenant => (
                                            <div key={tenant.id} className="flex items-center justify-between p-5 border border-slate-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-black shadow-md hover:shadow-lg transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-110 transition-transform">
                                                        {tenant.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 dark:text-white text-sm">{tenant.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 mt-1 uppercase tracking-widest">{tenant.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border shadow-sm ${
                                                        tenant.balance > 0 ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
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
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}