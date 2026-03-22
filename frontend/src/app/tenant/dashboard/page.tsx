import Link from 'next/link';

export default function TenantDashboard() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hello, Maria!</h1>
                <p className="text-slate-500 font-medium mt-1">Here is your account overview for this month.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <div className="md:col-span-2 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    
                    <h3 className="text-blue-200 font-bold uppercase tracking-wider text-sm mb-2">Current Balance Due</h3>
                    <p className="text-5xl font-black mb-1">₱ 3,500.00</p>
                    <p className="text-blue-200 font-medium text-sm mb-8">Due on November 5, 2026</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
                            Pay Now securely
                        </button>
                        <Link href="/tenant/payments" className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors active:scale-95 text-center">
                            View History
                        </Link>
                    </div>
                </div>

                {/* Room Info Card */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col justify-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Your Accommodation</h3>
                    <p className="text-2xl font-black text-slate-900 mb-4">Room 101</p>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Type</span>
                            <span className="font-bold text-slate-900">Standard Solo</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Status</span>
                            <span className="font-bold text-green-600">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                
                {/* Recent Payments */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-bold text-slate-900">Recent Transactions</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">October Rent</p>
                                    <p className="text-xs font-medium text-slate-500">Oct 4, 2026</p>
                                </div>
                            </div>
                            <span className="font-black text-slate-900 text-sm">₱ 3,500</span>
                        </div>
                        <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">September Rent</p>
                                    <p className="text-xs font-medium text-slate-500">Sep 2, 2026</p>
                                </div>
                            </div>
                            <span className="font-black text-slate-900 text-sm">₱ 3,500</span>
                        </div>
                    </div>
                </div>

                {/* Maintenance Banner */}
                <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    <h3 className="text-white font-black text-xl mb-2 relative z-10">Need something fixed?</h3>
                    <p className="text-slate-400 font-medium text-sm mb-6 relative z-10 max-w-sm">Submit a maintenance request directly to the admin. We'll handle it as soon as possible.</p>
                    <Link href="/tenant/requests" className="inline-flex w-max px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 relative z-10 text-sm">
                        Create Request
                    </Link>
                </div>

            </div>
        </div>
    );
}