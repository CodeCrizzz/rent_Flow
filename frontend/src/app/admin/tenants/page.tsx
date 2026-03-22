export default function AdminTenants() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenants Directory</h1>
                    <p className="text-slate-500 font-medium mt-1">View and manage all active and pending tenants.</p>
                </div>
                <div className="relative">
                    <input type="text" placeholder="Search tenants..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64" />
                    <svg className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900">Maria Santos</td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">maria@example.com</td>
                                <td className="px-6 py-4 font-bold text-slate-700">101</td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span></td>
                                <td className="px-6 py-4 text-right"><button className="text-blue-600 font-bold text-sm hover:underline">View</button></td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900">Juan Dela Cruz</td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">juan@example.com</td>
                                <td className="px-6 py-4 font-bold text-slate-700">204</td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending Due</span></td>
                                <td className="px-6 py-4 text-right"><button className="text-blue-600 font-bold text-sm hover:underline">View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}