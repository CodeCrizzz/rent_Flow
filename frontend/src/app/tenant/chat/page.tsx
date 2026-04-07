"use client";
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

// --- MESSAGE DATA STRUCTURE ---
interface ChatMessage {
    id?: number;
    message: string;
    sender_type: 'tenant' | 'admin';
    created_at: string;
    status?: 'Sent' | 'Delivered' | 'Seen';
}

export default function TenantChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const isAtBottom = useRef(true);

    // --- HANDLE MANUAL SCROLL ---
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            isAtBottom.current = scrollHeight - scrollTop - clientHeight < 100;
        }
    };

    // --- FETCH MESSAGES ---
    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/tenant/chat');
            // Ensure status exists for UI purposes
            const formattedData = data.map((msg: any) => ({
                ...msg,
                status: msg.status || 'Seen' // Defaulting to Seen for the UI mockup
            }));
            setMessages(formattedData);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Real-time polling
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, []);

    // --- AUTO SCROLL TO BOTTOM ---
    useEffect(() => {
        if (isAtBottom.current && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // --- SEND MESSAGE ---
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Optimistic UI update for instant feedback
        const optimisticMsg: ChatMessage = {
            message: newMessage,
            sender_type: 'tenant',
            created_at: new Date().toISOString(),
            status: 'Sent'
        };
        
        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage('');
        
        // Force scroll to bottom when tenant sends a message
        isAtBottom.current = true;
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        try {
            await api.post('/tenant/chat', { message: optimisticMsg.message });
            fetchMessages(); // Refresh to get actual DB ID and updated status
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // --- FORMAT TIME ---
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        /* --- FULL VIEWPORT GLASSMORPHISM CONTAINER --- */
        <div className="fixed inset-0 md:pl-[280px] z-[50] flex flex-col bg-slate-50 dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-500">
            
            {/* Custom Texture */}
            <style>{`
                .glass-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.04;
                    mix-blend-mode: overlay;
                    pointer-events: none;
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen"></div>
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-screen"></div>

            {/* ---> MAIN CHAT CONTAINER WITH PAGE TRANSITION <--- */}
            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.99 },
                    visible: { 
                        opacity: 1, 
                        y: 0,
                        scale: 1,
                        transition: { 
                            type: "spring",
                            stiffness: 80,
                            damping: 20,
                            mass: 1,
                            staggerChildren: 0.15 
                        } 
                    }
                }}
                className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 h-full"
            >

                {/* --- MAIN CHAT INTERFACE (Glass Box) --- */}
                <motion.div 
                    variants={{
                        hidden: { opacity: 0, scale: 0.98 },
                        visible: { opacity: 1, scale: 1 }
                    }}
                    className="flex-1 flex flex-col relative bg-white/60 dark:bg-[#0a0a0a]/60 border border-white/20 dark:border-white/10 rounded-[3rem] shadow-2xl backdrop-blur-2xl overflow-hidden min-h-0"
                >
                    <div className="absolute inset-0 glass-noise"></div>
                    
                    {/* 1. CHAT HEADER */}
                    <div className="relative z-10 flex items-center justify-between p-6 sm:px-10 border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                                    BA
                                </div>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0a0a0a] rounded-full"></div>
                            </div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Boarding Admin</h2>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                    Online <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:flex gap-3">
                            <button className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                <svg className="w-4 h-4 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                <svg className="w-4 h-4 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                            </button>
                        </div>
                    </div>

                    {/* 2. CHAT WINDOW (Messages) */}
                    <div 
                        ref={scrollRef} 
                        onScroll={handleScroll}
                        className="relative z-10 flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 scrollbar-hide scroll-smooth"
                    >
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center gap-4">
                                    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Syncing Messages...</span>
                                </motion.div>
                            ) : messages.length === 0 ? (
                                <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex items-center justify-center">
                                    <div className="text-center bg-black/5 dark:bg-white/5 p-8 rounded-[2rem] backdrop-blur-sm border border-black/5 dark:border-white/5">
                                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                        </div>
                                        <h4 className="text-sm font-black tracking-widest uppercase mb-2">Secure Line Open</h4>
                                        <p className="text-xs font-bold text-neutral-500">Send a message to contact the admin.</p>
                                    </div>
                                </motion.div>
                            ) : (
                                messages.map((msg, index) => (
                                    <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex w-full ${msg.sender_type === 'tenant' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex flex-col max-w-[75%] sm:max-w-[60%] lg:max-w-[50%] ${msg.sender_type === 'tenant' ? 'items-end' : 'items-start'} group`}>
                                            
                                            {/* Message Bubble */}
                                            <div className="relative flex items-center gap-2">

                                                <div className={`px-6 py-4 font-bold text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                                                    msg.sender_type === 'tenant' 
                                                        ? 'bg-blue-600 text-white rounded-[2rem] rounded-br-sm' 
                                                        : 'bg-black/10 dark:bg-white/10 text-slate-800 dark:text-white rounded-[2rem] rounded-bl-sm border border-black/5 dark:border-white/5'
                                                }`}>
                                                    {msg.message}
                                                </div>
                                            </div>

                                            {/* Message Details (Time & Status) */}
                                            <div className={`flex items-center gap-1.5 mt-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 ${msg.sender_type === 'tenant' ? 'justify-end' : 'justify-start'}`}>
                                                <span>{formatTime(msg.created_at)}</span>
                                                
                                                {/* Status Indicator (Only show for sent messages) */}
                                                {msg.sender_type === 'tenant' && (
                                                    <>
                                                        <span>•</span>
                                                        <span className={`flex items-center gap-0.5 ${msg.status === 'Seen' ? 'text-blue-500' : 'text-neutral-400'}`}>
                                                            {msg.status}
                                                            {/* Checkmarks */}
                                                            {msg.status === 'Sent' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                                            {msg.status === 'Delivered' && <div className="flex -space-x-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>}
                                                            {msg.status === 'Seen' && <div className="flex -space-x-1.5 text-blue-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 3. SEND MESSAGE SECTION */}
                    <div className="relative z-10 p-4 sm:p-6 bg-white/40 dark:bg-black/20 border-t border-black/5 dark:border-white/5 backdrop-blur-xl shrink-0">
                        <form onSubmit={handleSend} className="flex gap-3 items-center bg-white dark:bg-white/5 p-2 rounded-3xl border border-black/5 dark:border-white/10 shadow-inner">
                            
                            {/* Upload Attachment Button */}
                            <button type="button" className="p-3 text-neutral-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                            </button>

                            {/* Text Input */}
                            <input 
                                type="text" 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..." 
                                className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white px-2 outline-none placeholder:text-neutral-400" 
                            />

                            {/* Send Button */}
                            <button 
                                type="submit" 
                                disabled={!newMessage.trim() || isLoading}
                                className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 shrink-0"
                            >
                                <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}