export default function AdminRequests() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Requests</h1>
                    <p className="text-slate-500 font-medium mt-1">Track and resolve tenant issues and repairs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Request Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">High Priority</span>
                        <span className="text-sm font-medium text-slate-400">2 hours ago</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Leaking Faucet</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">The faucet in the bathroom is leaking continuously, making it hard to sleep.</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="text-sm">
                            <p className="font-bold text-slate-900">Room 105</p>
                            <p className="text-slate-500">Ana Reyes</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">Update Status</button>
                    </div>
                </div>

                {/* Request Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">In Progress</span>
                        <span className="text-sm font-medium text-slate-400">Yesterday</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Aircon Not Cooling</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">The AC unit turns on but only blows warm air.</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="text-sm">
                            <p className="font-bold text-slate-900">Room 204</p>
                            <p className="text-slate-500">Juan Dela Cruz</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">Update Status</button>
                    </div>
                </div>
            </div>
        </div>
    );
}