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
            
            if (data.length > 0 && !selectedTenant) {
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
            
            setConversations(prev => prev.map(c => 
                c.id === tenantId ? { ...c, unread_count: 0 } : c
            ));
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // Polling for the active conversation setup
    useEffect(() => {
        if (selectedTenant) {
            fetchMessages(selectedTenant.id);
            const interval = setInterval(() => {
                fetchMessages(selectedTenant.id);
                fetchConversations(); 
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
            fetchConversations();
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
        <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col relative">
            
            <div className="absolute top-0 right-20 w-96 h-96 bg-[#5b21b6]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <div className="mb-8 flex items-center justify-between relative z-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Messages</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-1">Direct communication with residents.</p>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex relative z-10">

                {/* Sidebar Contacts */}
                <div className="w-[340px] border-r border-slate-200 dark:border-zinc-800 flex flex-col bg-slate-50 dark:bg-zinc-900/30">
                    <div className="p-6 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Search tenant or room..." 
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none transition-all placeholder:text-slate-500 dark:text-zinc-500 text-slate-900 dark:text-white shadow-inner" 
                            />
                            <svg className="w-4 h-4 text-slate-500 dark:text-zinc-500 absolute left-3.5 top-3.5 group-focus-within:text-[#5b21b6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-10 text-center font-bold text-slate-500 dark:text-zinc-500 animate-pulse text-xs uppercase tracking-widest flex flex-col items-center gap-3">
                                <div className="w-6 h-6 border-2 border-[#5b21b6]/20 border-t-[#5b21b6] rounded-full animate-spin"></div>
                                Loading Chats...
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-10 text-center font-bold text-slate-500 dark:text-zinc-500 text-xs uppercase tracking-widest">No conversations found.</div>
                        ) : filteredConversations.map(conv => {
                            const unreadCount = Number(conv.unread_count);
                            const isSelected = selectedTenant?.id === conv.id;
                            
                            return (
                                <div 
                                    key={conv.id} 
                                    onClick={() => setSelectedTenant(conv)}
                                    className={`p-5 border-b border-slate-200 dark:border-zinc-800/50 cursor-pointer relative group transition-all hover:bg-slate-100 dark:hover:bg-zinc-800/40 ${isSelected ? 'bg-indigo-50 dark:bg-zinc-800/60' : 'bg-transparent'}`}
                                >
                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5b21b6] rounded-r-full shadow-[0_0_10px_rgba(91,33,182,0.8)]"></div>}
                                    <div className="flex justify-between items-start mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-black text-sm ${isSelected ? 'text-[#5b21b6] dark:text-[#a78bfa]' : 'text-slate-900 dark:text-white'}`}>{conv.name}</h4>
                                            {unreadCount > 0 && (
                                                <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-pulse">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[9px] uppercase tracking-wider font-bold ${unreadCount > 0 ? 'text-[#5b21b6] dark:text-indigo-400' : 'text-slate-500 dark:text-zinc-500'}`}>
                                            {formatTime(conv.last_message_time)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <p className={`text-xs truncate ${unreadCount > 0 ? 'text-slate-900 dark:text-zinc-300 font-bold' : 'text-slate-500 dark:text-zinc-500 font-medium'}`}></p>
                                        <span className="text-[9px] font-black text-slate-500 dark:text-zinc-600 uppercase shrink-0 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                                            {conv.room_number ? `Rm ${conv.room_number}` : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-transparent relative">
                    {selectedTenant ? (
                        <>
                            <div className="px-8 py-6 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-[#5b21b6] text-white flex items-center justify-center font-black shadow-[0_0_15px_rgba(91,33,182,0.3)]">
                                        {selectedTenant.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white leading-tight text-lg">{selectedTenant.name}</h3>
                                        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                            Room {selectedTenant.room_number || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div 
                                ref={scrollRef} 
                                className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth relative z-0"
                            >
                                <div className="min-h-full flex flex-col justify-end p-8 space-y-6">
                                {messages.length === 0 ? (
                                    <div className="h-full flex items-center justify-center flex-col gap-3 opacity-50">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                                            💬
                                        </div>
                                        <div className="text-slate-500 dark:text-zinc-400 font-bold text-sm">No message history with {selectedTenant.name}</div>
                                        <div className="text-slate-500 dark:text-zinc-500 text-xs font-medium">Send a message to start the conversation.</div>
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
                                                <div className="relative max-w-[75%]">
                                                    <div className={`${isFromAdmin ? 'bg-[#5b21b6] text-white rounded-2xl rounded-tr-none shadow-lg' : 'bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 rounded-2xl rounded-tl-none shadow-sm'} px-5 py-3 text-sm font-medium leading-relaxed`}>
                                                        {msg.message}
                                                    </div>
                                                    <div className={`flex items-center gap-2 mt-1.5 ${isFromAdmin ? 'justify-end mr-1' : 'ml-1'}`}>
                                                        <p className={`text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        {isFromAdmin && (
                                                            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest">
                                                                <span className={statusText === 'SEEN' ? 'text-[#5b21b6] dark:text-[#a78bfa]' : 'text-slate-400 dark:text-zinc-600'}>
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                                </span>
                                                                <span className={statusText === 'SEEN' ? 'text-[#5b21b6] dark:text-[#a78bfa]' : 'text-slate-400 dark:text-zinc-600'}>{statusText}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                </div>
                            </div>

                            <form onSubmit={handleSend} className="p-6 bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-slate-200 dark:border-zinc-800 relative z-10">
                                <div className="flex gap-3 items-center bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-2xl border border-slate-200 dark:border-zinc-800 focus-within:border-[#5b21b6]/40 focus-within:bg-white dark:bg-zinc-900 focus-within:shadow-xl transition-all duration-300">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Message ${selectedTenant.name}...`} 
                                        className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white px-4 py-2 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600" 
                                        autoFocus
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="px-6 py-3 bg-[#5b21b6] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#4c1d95] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-zinc-500 font-bold gap-4 opacity-70 relative z-10">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
                                📬
                            </div>
                            <h2 className="text-xl text-slate-900 dark:text-white tracking-tight">Select a conversation</h2>
                            <p className="font-medium text-slate-500 dark:text-zinc-500 text-sm">Choose a resident from the sidebar to view messages.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}