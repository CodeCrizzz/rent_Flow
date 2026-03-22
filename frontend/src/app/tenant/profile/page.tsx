export default function TenantProfile() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your personal information and security settings.</p>
            </div>

            {/* Personal Info Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input type="text" defaultValue="Maria Santos" disabled className="w-full bg-slate-50 border border-slate-200 text-slate-500 px-4 py-3 rounded-xl text-sm font-medium cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input type="email" defaultValue="maria@example.com" disabled className="w-full bg-slate-50 border border-slate-200 text-slate-500 px-4 py-3 rounded-xl text-sm font-medium cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <input type="text" defaultValue="0912 345 6789" className="w-full bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Emergency Contact</label>
                            <input type="text" defaultValue="Juan Santos (0998 765 4321)" className="w-full bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                        </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-sm">Save Changes</button>
                    </div>
                </div>
            </div>

            {/* Security Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">Security</h2>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full max-w-md bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full max-w-md bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="pt-2">
                        <button className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-sm">Update Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}