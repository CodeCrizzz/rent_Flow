"use client";
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function TenantChat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/tenant/chat');
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); 
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: any) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const res = await api.post('/tenant/chat', { message: newMessage });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <motion.div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto h-[calc(100vh-14rem)] flex flex-col relative px-4"
        >
            {/* Ambient Matrix Blurs */}
            <div className="absolute top-0 right-10 w-160 h-160 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            
            <header className="mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
                    Terminal: Secure Link Established
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Support Terminal</h1>
                <p className="text-slate-500 dark:text-zinc-400 font-medium mt-3">Encrypted direct line to property logistics and administrative staff.</p>
            </header>

            <div className="flex-1 bg-white dark:bg-[#0a0f1c]/90 rounded-4xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-blue-900/30 overflow-hidden flex flex-col relative group backdrop-blur-xl">
                {/* Spotlight Interaction */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 opacity-0 group-hover:opacity-100">
                    <div className="absolute inset-0" style={{
                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(79, 70, 229, 0.05), transparent 100%)`
                    }} />
                </div>

                <div className="p-8 border-b border-slate-100 dark:border-blue-900/30 bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between transition-colors duration-500">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-lg lg:text-xl">Node: Admin Logistics</h3>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Protocol Active • High Priority Response
                            </p>
                        </div>
                    </div>
                </div>
                
                <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto bg-slate-50/30 dark:bg-[#08080c]/40 space-y-8 scroll-smooth custom-scrollbar">
                    <style>{`
                        .chat-bubble-tenant {
                            background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
                            box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
                        }
                        .chat-bubble-admin {
                            background: rgba(255, 255, 255, 0.8);
                            backdrop-filter: blur(12px);
                            border: 1px solid rgba(226, 232, 240, 0.8);
                        }
                        .dark .chat-bubble-admin {
                            background: rgba(15, 23, 42, 0.6);
                            border: 1px solid rgba(30, 41, 59, 0.5);
                        }
                    `}</style>

                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center">
                                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                                <div className="font-black text-slate-400 dark:text-zinc-600 animate-pulse uppercase tracking-widest text-[10px]">Syncing Data Stream...</div>
                            </motion.div>
                        ) : messages.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex items-center justify-center text-center">
                                <div className="max-w-xs">
                                    <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-4xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-blue-900/30 shadow-inner">
                                        <span className="text-4xl grayscale opacity-30">💬</span>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3">No Comm-Logs Found</h4>
                                    <p className="text-slate-500 dark:text-blue-100/50 text-xs font-medium leading-relaxed uppercase tracking-wider">Start a transmission below. The cluster will respond momentarily.</p>
                                </div>
                            </motion.div>
                        ) : (
                            messages.map((msg, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: msg.sender_type === 'tenant' ? 20 : -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className={`flex ${msg.sender_type === 'tenant' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="relative group/msg">
                                        <div className={`${msg.sender_type === 'tenant' ? 'chat-bubble-tenant text-white rounded-tr-lg' : 'chat-bubble-admin text-slate-700 dark:text-zinc-300 rounded-tl-lg'} rounded-4xl px-8 py-5 max-w-sm lg:max-w-md text-[13px] font-bold leading-relaxed shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
                                            {msg.message}
                                        </div>
                                        <p className={`text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mt-3 flex items-center gap-2 ${msg.sender_type === 'tenant' ? 'justify-end mr-3' : 'justify-start ml-3'}`}>
                                            <span className={`w-1 h-1 rounded-full ${msg.sender_type === 'tenant' ? 'bg-indigo-400' : 'bg-slate-400'}`}></span>
                                            {msg.sender_type === 'tenant' ? 'Broadcast' : 'Intercept'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
 
                <form onSubmit={handleSend} className="p-8 bg-white dark:bg-[#0a0f1c] border-t border-slate-100 dark:border-blue-900/30 transition-colors duration-500">
                    <div className="flex gap-4 items-center bg-slate-50 dark:bg-black/20 p-2.5 rounded-2xl border border-slate-200 dark:border-blue-900/30 focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-[#0f172a] focus-within:ring-8 focus-within:ring-indigo-500/5 transition-all shadow-inner relative group/input">
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type encryption key or message..." 
                            className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white px-6 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600 relative z-10" 
                        />
                        <button type="submit" className="px-10 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95 relative z-10">Send Binary</button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}