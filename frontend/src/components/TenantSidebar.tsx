import Link from 'next/link';

export default function TenantSidebar() {
  return (
    <aside className="w-64 bg-white/70 backdrop-blur-xl text-slate-600 flex flex-col h-full border-r border-slate-200/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
      <div className="p-6 border-b border-slate-200/50">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" strokeWidth="2.5" /></svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Stay<span className="text-blue-600">Track</span>
          </span>
        </Link>
        <p className="text-[10px] text-slate-400 mt-2 font-bold tracking-widest uppercase">Tenant Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/tenant/dashboard" className="block px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm hover:scale-[1.02] text-slate-700 font-bold transition-all duration-300">Dashboard</Link>
        <Link href="/tenant/payments" className="block px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm hover:scale-[1.02] text-slate-700 font-bold transition-all duration-300">My Payments</Link>
        <Link href="/tenant/requests" className="block px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm hover:scale-[1.02] text-slate-700 font-bold transition-all duration-300">Maintenance</Link>
        <Link href="/tenant/profile" className="block px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm hover:scale-[1.02] text-slate-700 font-bold transition-all duration-300">My Profile</Link>
        <Link href="/tenant/chat" className="block px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm hover:scale-[1.02] text-slate-700 font-bold transition-all duration-300">Messages</Link>
      </nav>
      <div className="p-4 border-t border-slate-200/50">
        <button className="w-full text-left px-4 py-3 rounded-xl text-red-600 font-bold hover:bg-red-50 hover:scale-[1.02] transition-all duration-300">Log Out</button>
      </div>
    </aside>
  );
}