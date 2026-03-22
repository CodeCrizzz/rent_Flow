export default function AdminBilling() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Billing & Payments</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage invoices, track payments, and send reminders.</p>
                </div>
                <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    Create Invoice
                </button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Collected This Month</h3>
                    <p className="text-3xl font-black text-green-600">₱ 45,500</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Pending Invoices</h3>
                    <p className="text-3xl font-black text-yellow-600">₱ 12,000</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Overdue Amount</h3>
                    <p className="text-3xl font-black text-red-600">₱ 3,500</p>
                </div>
            </div>

            {/* Master Billing Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-500 text-sm">#INV-2026-101</td>
                                <td className="px-6 py-4 font-bold text-slate-900">Ana Reyes (Rm 105)</td>
                                <td className="px-6 py-4 font-black text-slate-900">₱ 3,500</td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">Oct 12, 2026</td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Overdue</span></td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 font-bold text-sm hover:underline">Remind</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-500 text-sm">#INV-2026-102</td>
                                <td className="px-6 py-4 font-bold text-slate-900">Juan Dela Cruz (Rm 204)</td>
                                <td className="px-6 py-4 font-black text-slate-900">₱ 4,000</td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">Nov 5, 2026</td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending</span></td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 font-bold text-sm hover:underline">Mark Paid</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}