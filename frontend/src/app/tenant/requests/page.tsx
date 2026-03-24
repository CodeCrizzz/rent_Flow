export default function TenantRequests() {
    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Maintenance</h1>
                <p className="text-slate-500 font-medium mt-2">Report issues with your room or common facilities.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Submit Form */}
                <div className="lg:col-span-1 bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 p-8 h-fit relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors"></div>
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        New Ticket
                    </h2>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issue Category</label>
                            <input type="text" placeholder="e.g. Plumbing, Electrical" className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Description</label>
                            <textarea rows={4} placeholder="What needs fixing?" className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none resize-none transition-all"></textarea>
                        </div>
                        <button type="button" className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Submit Ticket</button>
                    </form>
                </div>

                {/* Past Requests History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent History</h2>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">2 Total</span>
                    </div>
                    
                    <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 flex flex-col sm:flex-row justify-between sm:items-center gap-6 hover:border-indigo-100 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">Leaking Showerhead</h3>
                                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Oct 15, 2026 • Verified</p>
                            </div>
                        </div>
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100">Resolved</span>
                    </div>

                    <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 flex flex-col sm:flex-row justify-between sm:items-center gap-6 hover:border-indigo-100 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 group-hover:text-amber-600 transition-colors">Window Latch Broken</h3>
                                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Oct 20, 2026 • In Queue</p>
                            </div>
                        </div>
                        <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100">Pending</span>
                    </div>
                </div>
            </div>
        </div>
    );
}