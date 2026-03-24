export default function AdminChat() {
    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Messages</h1>
                    <p className="text-slate-500 font-medium mt-1">Direct communication with residents.</p>
                </div>
                <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-[#F8F9FA] bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400">T</div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-4 border-[#F8F9FA] bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">+5</div>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden flex">
                {/* Sidebar Contacts */}
                <div className="w-[340px] border-r border-slate-100 flex flex-col bg-slate-50/30">
                    <div className="p-6 border-b border-slate-100">
                        <div className="relative">
                            <input type="text" placeholder="Filter residents..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none transition-all" />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-5 border-b border-slate-100 bg-white cursor-pointer relative group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></div>
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-black text-slate-900 text-sm">Maria Santos</h4>
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">Online</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium truncate">Thank you, I'll pay it tomorrow.</p>
                        </div>
                        <div className="p-5 border-b border-slate-100 hover:bg-white cursor-pointer transition-all border-l-4 border-l-transparent group">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">Juan Dela Cruz</h4>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">2h ago</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium truncate group-hover:text-slate-500 transition-colors">Can I ask about the wifi password?</p>
                        </div>
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-white">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black border border-indigo-100">MS</div>
                            <div>
                                <h3 className="font-black text-slate-900 leading-tight">Maria Santos</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room 101 • Private Thread</p>
                            </div>
                        </div>
                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                        </button>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30 space-y-6 custom-scrollbar">
                        {/* Admin Message */}
                        <div className="flex justify-end animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="relative">
                                <div className="bg-indigo-600 text-white rounded-3xl rounded-tr-lg px-6 py-4 max-w-sm text-sm font-medium shadow-lg shadow-indigo-600/10 leading-relaxed">
                                    Hi Maria, just a quick reminder that rent is due on the 5th.
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right mt-2 mr-2">10:42 AM • DELIVERED</p>
                            </div>
                        </div>
                        {/* Tenant Message */}
                        <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="relative">
                                <div className="bg-white border border-slate-200 text-slate-700 rounded-3xl rounded-tl-lg px-6 py-4 max-w-sm text-sm font-medium shadow-sm leading-relaxed">
                                    Thank you, I'll pay it tomorrow morning!
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 ml-2">10:45 AM</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-white border-t border-slate-100">
                        <div className="flex gap-4 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-600/40 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                            <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                            </button>
                            <input type="text" placeholder="Compose message..." className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400" />
                            <button className="px-6 py-3.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}