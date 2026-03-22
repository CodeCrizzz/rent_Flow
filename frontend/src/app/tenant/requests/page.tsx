export default function TenantRequests() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance</h1>
                <p className="text-slate-500 font-medium mt-1">Submit repair requests for your room or common areas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submit Form */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 h-fit">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">New Request</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Issue Title</label>
                            <input type="text" placeholder="e.g. Broken Lightbulb" className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea rows={4} placeholder="Describe the problem..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"></textarea>
                        </div>
                        <button type="button" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-sm">Submit Request</button>
                    </form>
                </div>

                {/* Past Requests History */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">My Requests History</h2>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <h3 className="font-bold text-slate-900">Leaking Showerhead</h3>
                            <p className="text-slate-500 text-sm mt-1">Submitted on Sep 15, 2026</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full w-fit">Resolved</span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <h3 className="font-bold text-slate-900">Window Latch Broken</h3>
                            <p className="text-slate-500 text-sm mt-1">Submitted on Oct 20, 2026</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full w-fit">Pending Validation</span>
                    </div>
                </div>
            </div>
        </div>
    );
}