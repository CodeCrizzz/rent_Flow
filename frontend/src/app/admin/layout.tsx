"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setAdminName(JSON.parse(userStr).name);
    }, []);

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
    ];

    return (
        <div className="flex h-screen bg-[#FDFDFD] overflow-hidden selection:bg-blue-100 selection:text-blue-900">
            {/* Minimalist Sidebar */}
            <aside className="w-[260px] bg-[#0A0A0B] text-white flex-col hidden md:flex border-r border-zinc-800/50">
                <div className="p-7">
                    <Link href="/" className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight">RentFlow</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Menu</div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-zinc-800/80 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
                                <svg className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white border border-zinc-700">
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{adminName}</p>
                            <p className="text-xs text-zinc-500 truncate">Administrator</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
                        <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative h-screen overflow-hidden bg-slate-50/50">
                {/* Crisp Topbar */}
                <header className="h-16 border-b border-slate-200/80 bg-white flex items-center justify-between px-8 shrink-0">
                    <h2 className="text-sm font-semibold text-slate-800 capitalize">
                        {pathname.split('/').pop()?.replace('-', ' ')}
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-medium text-slate-500">System Online</span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}