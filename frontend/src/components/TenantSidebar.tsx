import Link from 'next/link';

export default function TenantSidebar() {
  return (
    <aside className="w-64 bg-white text-slate-600 flex flex-col h-full border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <span className="text-2xl font-black tracking-tight text-slate-900">
          Rent<span className="text-blue-600">Flow</span>
        </span>
        <p className="text-xs text-slate-400 mt-1 font-bold tracking-wider uppercase">Tenant Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/tenant/dashboard" className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors">Dashboard</Link>
        <Link href="/tenant/payments" className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors">My Payments</Link>
        <Link href="/tenant/requests" className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors">Maintenance</Link>
        <Link href="/tenant/profile" className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors">My Profile</Link>
      </nav>
      <div className="p-4 border-t border-slate-200">
        <button className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium">Log Out</button>
      </div>
    </aside>
  );
}