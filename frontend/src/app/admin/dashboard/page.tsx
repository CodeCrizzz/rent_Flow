import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back. Here is what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm">
                        Generate Report
                    </button>
                    <Link href="/admin/rooms" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                        Add Room
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Rooms</h3>
                    <p className="text-4xl font-black text-slate-900">24</p>
                    <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
                        <span>4 Available</span>
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Active Tenants</h3>
                    <p className="text-4xl font-black text-slate-900">42</p>
                    <p className="text-sm text-slate-500 font-medium mt-2">83% Occupancy Rate</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Pending Dues</h3>
                    <p className="text-4xl font-black text-slate-900">₱ 12,500</p>
                    <p className="text-sm text-red-600 font-bold mt-2">3 Tenants Overdue</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Maintenance</h3>
                    <p className="text-4xl font-black text-slate-900">2</p>
                    <p className="text-sm text-orange-600 font-bold mt-2">Open Requests</p>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">Recent Rent Payments</h2>
                    <Link href="/admin/billing" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-900">Maria Santos</td>
                                <td className="px-6 py-4 text-slate-500 font-medium">Room 101</td>
                                <td className="px-6 py-4 font-bold text-slate-900">₱ 3,500</td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">Today, 9:24 AM</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Paid</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-900">Juan Dela Cruz</td>
                                <td className="px-6 py-4 text-slate-500 font-medium">Room 204</td>
                                <td className="px-6 py-4 font-bold text-slate-900">₱ 4,000</td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">Yesterday</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-900">Ana Reyes</td>
                                <td className="px-6 py-4 text-slate-500 font-medium">Room 105</td>
                                <td className="px-6 py-4 font-bold text-slate-900">₱ 3,500</td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">Oct 12, 2025</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Overdue</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}