export default function TenantChat() {
    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contact Management</h1>
                <p className="text-slate-500 font-medium mt-1">Message the boarding house admin directly.</p>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">RentFlow Admin</h3>
                        <p className="text-xs text-green-600 font-bold">Usually replies within an hour</p>
                    </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 space-y-4">
                    {/* Admin Message */}
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm px-5 py-3 max-w-sm text-sm shadow-sm">
                            Hi Maria, just a quick reminder that rent is due on the 5th.
                        </div>
                    </div>
                    {/* Tenant Message */}
                    <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-sm text-sm shadow-sm">
                            Thank you, I'll pay it tomorrow morning!
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                    <input type="text" placeholder="Type your message..." className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                    <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">Send</button>
                </div>
            </div>
        </div>
    );
}