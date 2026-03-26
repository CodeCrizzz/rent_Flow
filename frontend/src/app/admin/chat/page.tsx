"use client";
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';

interface Conversation {
    id: number;
    name: string;
    room_number: string | null;
    last_message: string | null;
    last_message_time: string | null;
    unread_count: number | string;
}

interface Message {
    sender_id: number;
    receiver_id: number;
    message: string;
    sender_type: 'admin' | 'tenant';
    status: string;
    created_at: string;
}

export default function AdminChat() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedTenant, setSelectedTenant] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/admin/chat/conversations');
            setConversations(data);
            
            // Auto-select the first conversation if none is selected
            if (data.length > 0 && !selectedTenant) {
                // Find first with unread, or just the very first
                const firstUnread = data.find((c: Conversation) => Number(c.unread_count) > 0);
                setSelectedTenant(firstUnread || data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async (tenantId: number) => {
        try {
            const { data } = await api.get(`/admin/chat?tenant_id=${tenantId}`);
            setMessages(data);
            
            // Clear unread count locally for this tenant since we just fetched (and backend marked as read)
            setConversations(prev => prev.map(c => 
                c.id === tenantId ? { ...c, unread_count: 0 } : c
            ));
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    // Initial load
    useEffect(() => {
        fetchConversations();
    }, []);

    // Polling for the active conversation setup
    useEffect(() => {
        if (selectedTenant) {
            fetchMessages(selectedTenant.id);
            const interval = setInterval(() => {
                fetchMessages(selectedTenant.id);
                fetchConversations(); // Also refresh conversations list to update unread counts for others
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedTenant]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTenant) return;
        try {
            const res = await api.post('/admin/chat', { 
                message: newMessage,
                tenant_id: selectedTenant.id 
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
            fetchConversations(); // Update left panel to show our sent message as last message
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '';
        const msgDate = new Date(dateString);
        const today = new Date();
        
        if (msgDate.toDateString() === today.toDateString()) {
            return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const filteredConversations = conversations.filter(c => 
        c.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
        (c.room_number && c.room_number.toLowerCase().includes(searchFilter.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
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
                            <input 
                                type="text" 
                                placeholder="Search tenant or room..." 
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium text-slate-700" 
                            />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-10 text-center font-bold text-slate-400 animate-pulse text-xs uppercase tracking-widest">Loading Chats...</div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-10 text-center font-bold text-slate-400 text-xs">No conversations found.</div>
                        ) : filteredConversations.map(conv => {
                            const unreadCount = Number(conv.unread_count);
                            const isSelected = selectedTenant?.id === conv.id;
                            
                            return (
                                <div 
                                    key={conv.id} 
                                    onClick={() => setSelectedTenant(conv)}
                                    className={`p-5 border-b border-slate-100 cursor-pointer relative group transition-all hover:bg-white ${isSelected ? 'bg-white' : ''}`}
                                >
                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></div>}
                                    <div className="flex justify-between items-start mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-black text-sm ${isSelected ? 'text-indigo-600' : 'text-slate-900'} ${unreadCount > 0 ? 'text-slate-900' : ''}`}>{conv.name}</h4>
                                            {unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] uppercase tracking-wider font-bold ${unreadCount > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            {formatTime(conv.last_message_time)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <p className={`text-xs truncate ${unreadCount > 0 ? 'text-slate-700 font-bold' : 'text-slate-400 font-medium'}`}>
                                            {conv.last_message ? conv.last_message : <span className="italic text-slate-300">No messages yet</span>}
                                        </p>
                                        <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">
                                            {conv.room_number ? `Rm ${conv.room_number}` : ''}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
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
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                            Room {selectedTenant.room_number || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto bg-slate-50/30 space-y-6 custom-scrollbar scroll-smooth">
                                {messages.length === 0 ? (
                                    <div className="h-full flex items-center justify-center flex-col gap-3 opacity-50">
                                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-2xl">💬</div>
                                        <div className="text-slate-500 font-bold text-sm">No massage history with {selectedTenant.name}</div>
                                        <div className="text-slate-400 text-xs font-medium">Send a message to start the conversation.</div>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isFromAdmin = msg.sender_type === 'admin' || msg.sender_id === 1;
                                        
                                        // Status display logic
                                        let statusText = 'SENT';
                                        if (msg.status === 'delivered') statusText = 'DELIVERED';
                                        if (msg.status === 'read') statusText = 'SEEN';

                                        return (
                                            <div key={index} className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-${isFromAdmin ? 'right' : 'left'}-4 duration-500`}>
                                                <div className="relative">
                                                    <div className={`${isFromAdmin ? 'bg-indigo-600 text-white rounded-tr-lg' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-lg'} rounded-3xl px-6 py-4 max-w-md text-sm font-medium shadow-[0_4px_20px_rgb(0,0,0,0.03)] leading-relaxed`}>
                                                        {msg.message}
                                                    </div>
                                                    <div className={`flex items-center gap-2 mt-2 ${isFromAdmin ? 'justify-end mr-2' : 'ml-2'}`}>
                                                        <p className={`text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        {isFromAdmin && (
                                                            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest">
                                                                <span className={statusText === 'SEEN' ? 'text-blue-500' : 'text-slate-300'}>
                                                                    {statusText === 'SEEN' ? (
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                                    ) : (
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                                    )}
                                                                </span>
                                                                <span className={statusText === 'SEEN' ? 'text-blue-500 font-black' : 'text-slate-400'}>{statusText}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 relative z-10 shadow-[0_-10px_30px_rgb(0,0,0,0.02)]">
                                <div className="flex gap-4 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-600/40 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-indigo-600/5 transition-all duration-300">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Message ${selectedTenant.name}...`} 
                                        className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 px-4 py-2 outline-none placeholder:text-slate-400" 
                                        autoFocus
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-bold gap-4 opacity-70">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl shadow-inner">
                                📬
                            </div>
                            <h2 className="text-xl text-slate-800 tracking-tight">Select a conversation</h2>
                            <p className="font-medium text-slate-500 text-sm">Choose a resident from the sidebar to view messages.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}