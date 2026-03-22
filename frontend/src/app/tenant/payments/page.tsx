export default function TenantPayments() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Payments</h1>
                <p className="text-slate-500 font-medium mt-1">View your payment history and download receipts.</p>
            </div>

            {/* Next Payment Banner */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-blue-600">
                <div>
                    <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Next Payment Due</h3>
                    <p className="text-2xl font-black text-slate-900">₱ 3,500.00</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Due on November 5, 2026</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-sm">
                    Pay Online Now
                </button>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-slate-900 font-semibold text-sm">Oct 4, 2026</td>
                                <td className="px-6 py-4 text-slate-500 font-medium text-sm">October Rent - Room 101</td>
                                <td className="px-6 py-4 font-bold text-slate-900">₱ 3,500</td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Paid</span></td>
                                <td className="px-6 py-4 text-right"><button className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-end gap-1 w-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> PDF</button></td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-slate-900 font-semibold text-sm">Sep 2, 2026</td>
                                <td className="px-6 py-4 text-slate-500 font-medium text-sm">September Rent - Room 101</td>
                                <td className="px-6 py-4 font-bold text-slate-900">₱ 3,500</td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Paid</span></td>
                                <td className="px-6 py-4 text-right"><button className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-end gap-1 w-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> PDF</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}