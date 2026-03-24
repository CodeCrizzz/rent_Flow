import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <span className="text-2xl font-black tracking-tight text-white">
          Rent<span className="text-blue-500">Flow</span>
        </span>
        <p className="text-xs text-slate-500 mt-1 font-bold tracking-wider uppercase">Admin Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin/dashboard" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">Dashboard</Link>
        <Link href="/admin/rooms" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">Rooms</Link>
        <Link href="/admin/tenants" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">Tenants</Link>
        <Link href="/admin/billing" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">Billing & Payments</Link>
        <Link href="/admin/requests" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">Maintenance</Link>
        <Link href="/admin/chat" className="block px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">Messages</Link>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">Log Out</button>
      </div>
    </aside>
  );
}