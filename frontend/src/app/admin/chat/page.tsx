"use client";
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';

export default function AdminChat() {
    const [tenants, setTenants] = useState<any[]>([]);
    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/admin/tenants'); // Getting tenants list for chat
            setTenants(data);
            if (data.length > 0 && !selectedTenant) {
                setSelectedTenant(data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async (tenantId: number) => {
        try {
            const { data } = await api.get(`/chat?tenant_id=${tenantId}`);
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedTenant) {
            fetchMessages(selectedTenant.id);
            const interval = setInterval(() => fetchMessages(selectedTenant.id), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedTenant]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: any) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTenant) return;
        try {
            const res = await api.post('/chat', { 
                message: newMessage,
                tenant_id: selectedTenant.id 
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Messages</h1>
                    <p className="text-slate-500 font-medium mt-1">Direct communication with residents.</p>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden flex relative">
                {/* Sidebar Contacts */}
                <div className="w-[340px] border-r border-slate-100 flex flex-col bg-slate-50/10">
                    <div className="p-6 border-b border-slate-100 bg-white/50">
                        <div className="relative">
                            <input type="text" placeholder="Filter residents..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none transition-all" />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-10 text-center font-bold text-slate-400 animate-pulse text-xs uppercase tracking-widest">Loading...</div>
                        ) : tenants.map(tenant => (
                            <div 
                                key={tenant.id} 
                                onClick={() => setSelectedTenant(tenant)}
                                className={`p-5 border-b border-slate-100 cursor-pointer relative group transition-all hover:bg-white ${selectedTenant?.id === tenant.id ? 'bg-white' : ''}`}
                            >
                                {selectedTenant?.id === tenant.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></div>}
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-black text-sm ${selectedTenant?.id === tenant.id ? 'text-indigo-600' : 'text-slate-900'}`}>{tenant.name}</h4>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{tenant.room_number ? `Room ${tenant.room_number}` : 'No Room'}</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium truncate italic">Click to view conversation</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedTenant ? (
                        <>
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-600/20">
                                        {selectedTenant.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 leading-tight text-lg">{selectedTenant.name}</h3>
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Resident • Thread Verified</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto bg-slate-50/30 space-y-6 custom-scrollbar scroll-smooth">
                                {messages.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-slate-400 font-bold text-sm">No message history with {selectedTenant.name}.</div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-${msg.sender_type === 'admin' ? 'right' : 'left'}-4 duration-500`}>
                                            <div className="relative">
                                                <div className={`${msg.sender_type === 'admin' ? 'bg-indigo-600 text-white rounded-tr-lg' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-lg'} rounded-3xl px-6 py-4 max-w-sm text-sm font-medium shadow-sm leading-relaxed`}>
                                                    {msg.message}
                                                </div>
                                                <p className={`text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 ${msg.sender_type === 'admin' ? 'text-right mr-2' : 'ml-2'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {msg.sender_type === 'admin' ? 'SENT' : 'RECEIVED'}
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
                                        placeholder={`Message ${selectedTenant.name}...`} 
                                        className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 px-4 outline-none placeholder:text-slate-400" 
                                    />
                                    <button type="submit" className="px-8 py-3.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Send</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">
                            Select a resident to start messaging.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}