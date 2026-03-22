export default function AdminRooms() {
    // Dummy data for UI visualization
    const rooms = [
        { id: 1, number: '101', capacity: 1, price: '3,500', status: 'occupied', tenant: 'Maria Santos' },
        { id: 2, number: '102', capacity: 2, price: '5,000', status: 'available', tenant: null },
        { id: 3, number: '103', capacity: 1, price: '3,500', status: 'maintenance', tenant: null },
        { id: 4, number: '201', capacity: 4, price: '8,000', status: 'occupied', tenant: 'Group A' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Room Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage room statuses, pricing, and occupancy.</p>
                </div>
                <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    Add New Room
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl">
                                {room.number}
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                room.status === 'available' ? 'bg-green-100 text-green-700' : 
                                room.status === 'occupied' ? 'bg-blue-100 text-blue-700' : 
                                'bg-orange-100 text-orange-700'
                            }`}>
                                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                            </span>
                        </div>
                        <div className="space-y-2 mb-6 flex-1">
                            <p className="text-sm font-medium text-slate-500 flex justify-between">
                                Capacity: <span className="font-bold text-slate-900">{room.capacity} Person(s)</span>
                            </p>
                            <p className="text-sm font-medium text-slate-500 flex justify-between">
                                Rent: <span className="font-bold text-slate-900">₱ {room.price}/mo</span>
                            </p>
                            {room.tenant && (
                                <p className="text-sm font-medium text-slate-500 flex justify-between">
                                    Tenant: <span className="font-bold text-slate-900">{room.tenant}</span>
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <button className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors">Edit</button>
                            <button className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors">Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}