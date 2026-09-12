"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import api from '@/lib/api';
import { ThemeToggle } from "@/components/theme-toggle";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/app-sidebar';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [tenantName, setTenantName] = useState('Tenant');
    const [tenantEmail, setTenantEmail] = useState('tenant@renttrack.com');
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await api.get('/tenant/chat/unread');
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch unread count', error);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setTenantName(user.name);
            if (user.email) setTenantEmail(user.email);
        }

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 15000);
        return () => clearInterval(interval);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    const rawNavItems = [
        { name: 'Dashboard', path: '/tenant/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { name: 'Rooms', path: '/tenant/rooms', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'My Payments', path: '/tenant/payments', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z' },
        { name: 'Maintenance', path: '/tenant/requests', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        { name: 'My Profile', path: '/tenant/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { name: 'Messages', path: '/tenant/chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    ];

    const mappedNavItems = rawNavItems.map(item => {
        const isActive = pathname === item.path;
        let badgeCount = 0;
        let badgeColor: "rose" | "amber" | "indigo" | "blue" = "blue";

        if (item.name === 'Messages' && unreadCount > 0) {
            badgeCount = unreadCount;
            badgeColor = "rose";
        }

        return {
            title: item.name,
            url: item.path,
            isActive,
            badgeCount,
            badgeColor,
            icon: (
                <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-zinc-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2.5" : "2"} d={item.icon}></path>
                </svg>
            )
        }
    });

    const getPageTitle = () => {
        const path = pathname.split('/').pop();
        if (!path) return 'Dashboard';
        return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-black text-slate-900 dark:text-zinc-50 overflow-hidden selection:bg-cyan-500/30">
                <AppSidebar 
                    navLabel="Resident Portal"
                    navItems={mappedNavItems}
                    user={{
                        name: tenantName,
                        email: tenantEmail,
                        avatar: "",
                        role: "Resident"
                    }}
                    onLogout={handleLogout}
                />

                <SidebarInset className="flex-1 flex flex-col relative w-full h-[100dvh] overflow-hidden bg-transparent">
                    {/* Modern Top Header */}
                    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/5 bg-white dark:bg-[#0a0a0a] backdrop-blur-2xl px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-none">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                            <SidebarTrigger className="-ml-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white" />
                            <div className="h-5 w-px bg-slate-200 dark:bg-zinc-800 hidden sm:block" />
                            <div className="flex flex-col">
                                <h1 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                    {getPageTitle()}
                                </h1>
                                <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest hidden sm:block">
                                    Resident Portal
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
                                )}
                            </button>
                            <ThemeToggle />
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 bg-slate-50 dark:bg-black">
                        <div className="px-3 py-4 md:px-4 md:py-6 lg:px-5 lg:py-6 relative z-10">
                            <AnimatePresence mode="wait">
                                <PageTransition key={pathname}>
                                    {children}
                                </PageTransition>
                            </AnimatePresence>
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}