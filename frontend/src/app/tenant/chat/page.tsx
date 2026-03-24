export default function TenantChat() {
    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-10rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support Desk</h1>
                <p className="text-slate-500 font-medium mt-1">Directly chat with the property management.</p>
            </div>

            <div className="flex-1 bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden flex flex-col relative group">
                <div className="p-8 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg">Property Management</h3>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Automated Support Active • 24/7</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30 space-y-8 custom-scrollbar">
                    {/* Admin Message */}
                    <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="relative">
                            <div className="bg-white border border-slate-200 text-slate-700 rounded-3xl rounded-tl-lg px-6 py-4 max-w-sm text-sm font-medium shadow-sm leading-relaxed">
                                Hi Maria, just a quick reminder that rent is due on the 5th.
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 ml-2">ADMIN • 10:42 AM</p>
                        </div>
                    </div>
                    {/* Tenant Message */}
                    <div className="flex justify-end animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="relative">
                            <div className="bg-indigo-600 text-white rounded-3xl rounded-tr-lg px-6 py-4 max-w-sm text-sm font-medium shadow-lg shadow-indigo-600/10 leading-relaxed">
                                Thank you, I'll pay it tomorrow morning!
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right mt-2 mr-2">ME • 10:45 AM • READ</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100">
                    <div className="flex gap-4 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-600/40 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                        <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                        </button>
                        <input type="text" placeholder="Write a message..." className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400" />
                        <button className="px-8 py-3.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Send Message</button>
                    </div>
                </div>
            </div>
        </div>
    );
}