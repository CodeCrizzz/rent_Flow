"use client";
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';

export default function TenantChat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

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
        <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col relative animate-in fade-in slide-in-from-bottom-4 transition-colors duration-500">
            <div className="absolute top-0 left-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            
            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">Support Desk</h1>
                <p className="text-slate-500 dark:text-zinc-400 font-medium mt-1 transition-colors duration-500">Directly chat with the property management.</p>
            </div>

            <div className="flex-1 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-xl dark:shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col relative group transition-colors duration-500">
                <div className="p-8 border-b border-slate-100 dark:border-zinc-900 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shadow-sm transition-colors duration-500">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-lg transition-colors duration-500">Property Management</h3>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Automated Support Active • 24/7</p>
                        </div>
                    </div>
                </div>
                
                <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto bg-slate-50/30 dark:bg-[#080808]/50 space-y-8 custom-scrollbar scroll-smooth transition-colors duration-500">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center font-black text-slate-400 dark:text-zinc-600 animate-pulse uppercase tracking-[.2em] text-xs">Establishing secure connection...</div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center">
                            <div className="max-w-xs">
                                <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-zinc-800 shadow-sm">
                                    <span className="text-3xl">💬</span>
                                </div>
                                <p className="text-slate-400 dark:text-zinc-500 font-bold mb-2">No messages yet.</p>
                                <p className="text-slate-500 dark:text-zinc-500 text-xs font-medium leading-relaxed">Start a conversation with management if you have any questions or concerns. Responses are typical in under 2h.</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender_type === 'tenant' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-${msg.sender_type === 'tenant' ? 'right' : 'left'}-4 duration-500`}>
                                <div className="relative">
                                    <div className={`${msg.sender_type === 'tenant' ? 'bg-indigo-600 text-white rounded-tr-lg shadow-lg shadow-indigo-600/10' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 rounded-tl-lg shadow-sm'} rounded-3xl px-6 py-4 max-w-sm text-sm font-medium leading-relaxed transition-colors duration-500`}>
                                        {msg.message}
                                    </div>
                                    <p className={`text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] mt-3 ${msg.sender_type === 'tenant' ? 'text-right mr-2' : 'ml-2'}`}>
                                        {msg.sender_type === 'tenant' ? 'ME' : 'ADMIN'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
 
                <form onSubmit={handleSend} className="p-8 bg-white dark:bg-[#0a0a0a] border-t border-slate-100 dark:border-zinc-900 transition-colors duration-500">
                    <div className="flex gap-4 items-center bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-2xl border border-slate-200 dark:border-zinc-800 focus-within:border-indigo-600 focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message here..." 
                            className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white px-4 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600" 
                        />
                        <button type="submit" className="px-10 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">Send Message</button>
                    </div>
                </form>
            </div>
        </div>
    );
}