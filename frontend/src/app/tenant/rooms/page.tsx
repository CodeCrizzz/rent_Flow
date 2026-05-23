"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion, Variants, AnimatePresence } from 'framer-motion';

export default function TenantRooms() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Modal states
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setIsLoading(true);
                const { data } = await api.get('/tenant/rooms');
                setRooms(data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleChooseRoom = async () => {
        if (!selectedRoom) return;
        setIsSubmitting(true);
        setErrorMsg("");
        
        try {
            const { data } = await api.post('/tenant/rooms/choose', { room_id: selectedRoom.id });
            setSuccessMsg(data.message);
            // Re-fetch rooms to update slots
            const roomsResponse = await api.get('/tenant/rooms');
            setRooms(roomsResponse.data);
            
            // Optionally close modal after delay
            setTimeout(() => {
                setSelectedRoom(null);
                setSuccessMsg("");
            }, 2500);

        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Failed to select room");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredRooms = rooms.filter(r => 
        r.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
    };
    
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="flex-1 flex flex-col w-full min-h-full text-neutral-900 dark:text-neutral-100 font-sans bg-transparent">
            {/* Page Transition Overlay */}
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="absolute inset-0 z-[9999] bg-slate-50 dark:bg-[#050505] pointer-events-none" />

            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-8xl mx-auto w-full flex flex-col gap-4 sm:gap-6 pt-0 sm:pt-6 px-2 sm:px-8 pb-12 sm:pb-20 lg:pb-32 relative z-10 min-h-full">
                
                {/* --- HEADER --- */}
                <motion.header variants={itemVariants} className="sticky top-0 z-40 shrink-0 flex flex-row items-center justify-between h-14 bg-linear-to-b from-white/80 to-white/40 dark:from-[#050505]/80 dark:to-[#050505]/40 backdrop-blur-2xl -mx-2 px-4 sm:mx-0 sm:px-0 mb-1 sm:mb-2 transition-all">
                    <div className="flex flex-row items-center gap-3 sm:gap-4 h-full">
                        <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-neutral-900 via-indigo-800 to-neutral-900 dark:from-white dark:via-indigo-200 dark:to-white leading-none">
                            Available Rooms
                        </h1>
                    </div>
                </motion.header>

                {/* --- TOOLBAR --- */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input 
                            type="text" 
                            placeholder="Search by room number or type..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full h-11 sm:h-12 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/10 rounded-xl pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
                        />
                    </div>
                </motion.div>

                {/* --- ROOM GRID --- */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-2">
                    {isLoading ? (
                        <div className="col-span-full py-12 text-center text-sm font-semibold text-neutral-500">Loading rooms...</div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-sm font-semibold text-neutral-500">No rooms found.</div>
                    ) : (
                        filteredRooms.map(room => {
                            const isFull = room.available_slots <= 0 || room.status === 'Maintenance';
                            return (
                                <div key={room.id} className={`flex flex-col relative rounded-[1.5rem] bg-white dark:bg-[#121212] backdrop-blur-2xl shadow-xl shadow-indigo-500/5 border border-neutral-200/50 dark:border-white/5 overflow-hidden transition-all duration-300 ${isFull ? 'opacity-80 grayscale-[20%]' : 'hover:scale-[1.02] hover:shadow-indigo-500/10'}`}>
                                    {room.status === 'Maintenance' && (
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500 z-20"></div>
                                    )}
                                    <div className="p-5 sm:p-6 flex flex-col h-full z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-neutral-900 dark:text-white leading-none tracking-tight">Room {room.room_number}</h3>
                                                <p className="text-xs font-semibold text-indigo-500 mt-1 uppercase tracking-wider">{room.type}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full border ${isFull ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                                {room.status === 'Maintenance' ? 'Maintenance' : isFull ? 'Full' : `${room.available_slots} Left`}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 mb-5">
                                            <div className="bg-neutral-50 dark:bg-white/[0.02] rounded-xl p-3 border border-neutral-200/50 dark:border-white/5">
                                                <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-0.5">Rent / Month</p>
                                                <p className="text-sm font-black text-neutral-900 dark:text-white font-mono">₱{Number(room.price).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-neutral-50 dark:bg-white/[0.02] rounded-xl p-3 border border-neutral-200/50 dark:border-white/5">
                                                <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-0.5">Capacity</p>
                                                <p className="text-sm font-black text-neutral-900 dark:text-white font-mono">{room.current_occupants} / {room.capacity}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-2">
                                            <button 
                                                disabled={isFull}
                                                onClick={() => setSelectedRoom(room)}
                                                className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors ${isFull ? 'bg-neutral-100 dark:bg-white/5 text-neutral-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
                                            >
                                                {isFull ? 'Unavailable' : 'Choose Room'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </motion.div>
            </motion.div>

            {/* --- CONFIRMATION MODAL --- */}
            <AnimatePresence>
                {selectedRoom && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 bg-neutral-900/60 dark:bg-black/70 backdrop-blur-sm z-[100]" 
                            onClick={() => !isSubmitting && setSelectedRoom(null)} 
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                                className="w-full max-w-md bg-white dark:bg-[#18181B] rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden pointer-events-auto flex flex-col"
                            >
                                <div className="p-5 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center bg-neutral-50/50 dark:bg-white/[0.02]">
                                    <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">Confirm Room Selection</h2>
                                    <button onClick={() => !isSubmitting && setSelectedRoom(null)} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                <div className="p-6 flex flex-col gap-4">
                                    {errorMsg && <div className="p-3 bg-red-500/10 rounded-xl text-red-500 text-xs font-bold">{errorMsg}</div>}
                                    {successMsg ? (
                                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                                            <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <p className="text-sm font-bold text-emerald-500">{successMsg}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                You are about to select <span className="font-bold text-indigo-500">Room {selectedRoom.room_number}</span>. 
                                                You will be immediately assigned to this room and your account will become Active.
                                            </p>
                                            <div className="bg-neutral-50 dark:bg-black/20 rounded-xl p-4 border border-neutral-200 dark:border-white/5 mt-2">
                                                <div className="flex justify-between text-xs mb-2"><span className="text-neutral-500 font-bold uppercase">Type</span><span className="font-semibold text-neutral-900 dark:text-white">{selectedRoom.type}</span></div>
                                                <div className="flex justify-between text-xs mb-2"><span className="text-neutral-500 font-bold uppercase">Rent</span><span className="font-semibold text-neutral-900 dark:text-white font-mono">₱{Number(selectedRoom.price).toLocaleString()} / mo</span></div>
                                                <div className="flex justify-between text-xs"><span className="text-neutral-500 font-bold uppercase">Capacity</span><span className="font-semibold text-neutral-900 dark:text-white">{selectedRoom.capacity} People</span></div>
                                            </div>
                                            <button 
                                                onClick={handleChooseRoom}
                                                disabled={isSubmitting} 
                                                className="w-full py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white mt-2 transition-colors shadow-lg shadow-indigo-500/20"
                                            >
                                                {isSubmitting ? 'Confirming...' : 'Yes, Choose this Room'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
