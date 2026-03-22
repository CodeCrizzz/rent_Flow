export default function AdminChat() {
    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Messages</h1>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex">
                {/* Sidebar Contacts */}
                <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/30">
                    <div className="p-4 border-b border-slate-100">
                        <input type="text" placeholder="Search tenants..." className="w-full px-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 border-b border-slate-100 bg-white cursor-pointer border-l-4 border-l-blue-600">
                            <h4 className="font-bold text-slate-900">Maria Santos</h4>
                            <p className="text-xs text-slate-500 truncate mt-1">Thank you, I'll pay it tomorrow.</p>
                        </div>
                        <div className="p-4 border-b border-slate-100 hover:bg-white cursor-pointer transition-colors border-l-4 border-l-transparent">
                            <h4 className="font-bold text-slate-900">Juan Dela Cruz</h4>
                            <p className="text-xs text-slate-500 truncate mt-1">Can I ask about the wifi password?</p>
                        </div>
                    </div>
                </div>

                {/* Chat Window */}
                <div className="w-2/3 flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="font-bold text-slate-900">Maria Santos</h3>
                            <p className="text-xs text-slate-500">Room 101 • Online</p>
                        </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4">
                        {/* Admin Message */}
                        <div className="flex justify-end">
                            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-sm text-sm shadow-sm">
                                Hi Maria, just a quick reminder that rent is due on the 5th.
                            </div>
                        </div>
                        {/* Tenant Message */}
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm px-5 py-3 max-w-sm text-sm shadow-sm">
                                Thank you, I'll pay it tomorrow morning!
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                        <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                        <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}