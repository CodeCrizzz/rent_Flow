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
            const { data } = await api.get('/chat');
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Polling for "real-time"
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
            const res = await api.post('/chat', { message: newMessage });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-10rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support Desk</h1>
                <p className="text-slate-500 font-medium mt-1">Directly chat with the property management.</p>
            </div>

            <div className="flex-1 bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden flex flex-col relative group">
                <div className="p-8 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg">Property Management</h3>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Automated Support Active • 24/7</p>
                        </div>
                    </div>
                </div>
                
                <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto bg-slate-50/30 space-y-8 custom-scrollbar scroll-smooth">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center font-bold text-slate-400 animate-pulse">Establishing connection...</div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center">
                            <div className="max-w-xs">
                                <p className="text-slate-400 font-bold mb-2">No messages yet.</p>
                                <p className="text-slate-500 text-xs font-medium">Start a conversation with management if you have any questions or concerns.</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender_type === 'tenant' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-${msg.sender_type === 'tenant' ? 'right' : 'left'}-4 duration-500`}>
                                <div className="relative">
                                    <div className={`${msg.sender_type === 'tenant' ? 'bg-indigo-600 text-white rounded-tr-lg' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-lg'} rounded-3xl px-6 py-4 max-w-sm text-sm font-medium shadow-sm leading-relaxed`}>
                                        {msg.message}
                                    </div>
                                    <p className={`text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 ${msg.sender_type === 'tenant' ? 'text-right mr-2' : 'ml-2'}`}>
                                        {msg.sender_type === 'tenant' ? 'ME' : 'ADMIN'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100">
                    <div className="flex gap-4 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-600/40 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message here..." 
                            className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 px-4 outline-none placeholder:text-slate-400" 
                        />
                        <button type="submit" className="px-8 py-3.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Send</button>
                    </div>
                </form>
            </div>
        </div>
    );
}