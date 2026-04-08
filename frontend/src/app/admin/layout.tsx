"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [adminName, setAdminName] = useState('Admin');
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch('http://localhost:5000/api/admin/chat/unread', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch unread count', error);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setAdminName(JSON.parse(userStr).name);
        
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 15000);
        return () => clearInterval(interval);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { name: 'Rooms', path: '/admin/rooms', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Tenants', path: '/admin/tenants', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Billing', path: '/admin/billing', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z' },
        { name: 'Requests', path: '/admin/requests', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        { name: 'Communications', path: '/admin/chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white overflow-hidden selection:bg-indigo-500/30 transition-colors duration-500">
            <aside className="w-[280px] bg-white/80 dark:bg-[#0a0a0c]/90 backdrop-blur-3xl flex-col hidden md:flex border-r border-slate-200 dark:border-white/5 shadow-2xl z-20 relative transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-64 bg-indigo-600/10 dark:bg-indigo-600/5 blur-[80px] pointer-events-none"></div>

                <div className="p-8 relative z-10">
                    <div className="inline-flex items-center gap-3 transition-opacity group cursor-default">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-500">
                            <svg className="w-6 h-6 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Rent<span className="text-indigo-600 dark:text-indigo-400">Flow</span></span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-3 mt-6 relative z-10">
                    <div className="px-4 mb-6 text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-[0.2em]">Navigation</div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path} className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 relative ${isActive ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-slate-900 dark:text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] dark:shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'text-slate-600 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-slate-50 dark:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-300'}`}>
                                <svg className={`w-5 h-5 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon}></path></svg>
                                <span className="flex-1">{item.name}</span>
                                {item.name === 'Communications' && unreadCount > 0 && (
                                    <span className="flex h-5 items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-black text-slate-900 dark:text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-5 border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/20 relative z-10 transition-colors duration-500">
                    <div className="flex items-center gap-3 px-3 py-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-sm font-black text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-inner">
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{adminName}</p>
                            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest truncate flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Master Admin
                            </p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-zinc-500 bg-slate-200/50 dark:bg-zinc-900/50 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/20 border border-transparent transition-all duration-300 group">
                        Sign Out
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 relative z-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-bg-slate-100 dark:bg-[#050505] scrollbar-track-transparent">
                    <AnimatePresence mode="wait">
                        <PageTransition key={pathname}>
                            {children}
                        </PageTransition>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}