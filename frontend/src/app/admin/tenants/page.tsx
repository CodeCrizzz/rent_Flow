"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';

// 1. Updated Interface matching all your required fields
interface Tenant {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    room_number: string | null;
    room_id: number | null;
    
    // New Fields
    gender?: string;
    id_document?: string;
    bed_space?: string;
    date_moved_in?: string;
    contract_end_date?: string;
    monthly_rent?: number;
    payment_status?: 'Paid' | 'Unpaid' | 'Overdue';
    last_payment_date?: string;
    balance?: number;
    status: 'Active' | 'Inactive' | 'Moved Out' | 'Pending';
}

interface Room {
    id: number;
    room_number: string;
    status: string;
}

export default function AdminTenants() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    
    // --- MODAL & FORM STATES ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        room_id: '' as string | number
    });

    const fetchTenants = async () => {
        try {
            const { data } = await api.get('/admin/tenants');
            
            // Mapping backend data and adding fallbacks for the new fields 
            // so the UI works while you update your database
            const enrichedData = data.map((t: any) => ({
                ...t,
                gender: t.gender || 'Not Specified',
                id_document: t.id_document ? 'Verified' : 'Pending',
                bed_space: t.bed_space || 'N/A',
                date_moved_in: t.date_moved_in ? new Date(t.date_moved_in).toLocaleDateString() : new Date(t.created_at).toLocaleDateString(),
                contract_end_date: t.contract_end_date ? new Date(t.contract_end_date).toLocaleDateString() : '12/31/2026',
                monthly_rent: t.monthly_rent || 5500,
                payment_status: t.balance > 0 ? 'Overdue' : 'Paid',
                last_payment_date: t.last_payment_date || 'N/A',
                balance: t.balance || 0,
                status: t.status || (t.room_number ? 'Active' : 'Pending')
            }));

            setTenants(enrichedData);
        } catch (err: any) {
            console.error("Failed to fetch tenants:", err);
            setError("Failed to load residents list.");
        }
    };

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/admin/rooms');
            setRooms(data);
        } catch (err: any) {
            console.error("Failed to fetch rooms:", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await Promise.all([fetchTenants(), fetchRooms()]);
            setIsLoading(false);
        };
        init();
    }, []);

    const handleOpenModal = (tenant?: Tenant) => {
        if (tenant) {
            setEditingTenant(tenant);
            setFormData({
                name: tenant.name,
                email: tenant.email,
                phone: tenant.phone || '',
                password: '', 
                room_id: tenant.room_id?.toString() ?? ''
            });
        } else {
            setEditingTenant(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                room_id: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            if (editingTenant) {
                await api.put(`/admin/tenants/${editingTenant.id}`, formData);
            } else {
                await api.post('/admin/tenants', formData);
            }
            setIsModalOpen(false);
            fetchTenants(); 
        } catch (err: any) {
            console.error("Operation failed:", err);
            setError(err.response?.data?.message || "Operation failed. Please check your data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTenant = async (id: number) => {
        if (!window.confirm("Are you sure you want to remove this tenant? This action cannot be undone.")) return;
        
        setIsDeleting(id);
        setError('');
        
        try {
            await api.delete(`/admin/tenants/${id}`);
            setTenants((prev) => prev.filter((tenant) => tenant.id !== id));
        } catch (err: any) {
            console.error("Failed to delete tenant:", err);
            setError("Failed to delete resident. They might have active dependencies (like payments).");
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredTenants = tenants.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.room_number && t.room_number.toString().includes(searchQuery))
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tenants Directory</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage all active residents and pending applications.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search residents..." className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 w-full sm:w-80 shadow-sm transition-all" />
                        <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <button onClick={() => handleOpenModal()} className="px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 text-sm flex items-center gap-2 group">
                        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        Add Resident
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                    {error}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">{editingTenant ? 'Edit Resident' : 'Add New Resident'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none" placeholder="e.g. John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none" placeholder="+63 000 000 0000" />
                                </div>
                            </div>
                            {!editingTenant && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Account Password</label>
                                    <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none" placeholder="••••••••" />
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Assigned Unit</label>
                                <select 
                                    value={formData.room_id?.toString() || ''} 
                                    onChange={e => setFormData({...formData, room_id: e.target.value})} 
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/40 outline-none appearance-none"
                                >
                                    <option value="">Unassigned / Pending</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id.toString()}>Room {room.room_number} ({room.status})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4">
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    editingTenant ? 'Update Records' : 'Register Resident'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident Profile</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rental Info</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financials</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center">
                                        <div className="inline-block w-6 h-6 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                                        <p className="mt-3 font-bold text-slate-400 text-xs">Fetching residents...</p>
                                    </td>
                                </tr>
                            ) : filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold text-sm">
                                        {searchQuery ? "No residents match your search." : "No residents found."}
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                                        
                                        {/* 1. Basic Information */}
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
                                                    {tenant.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{tenant.name}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{tenant.email} • {tenant.phone}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gender: {tenant.gender} • ID: {tenant.id_document}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 2. Room & Rental Info */}
                                        <td className="px-6 py-6">
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">
                                                    {tenant.room_number ? `Room ${tenant.room_number}` : 'Unassigned'} 
                                                    {tenant.bed_space !== 'N/A' && ` • Bed ${tenant.bed_space}`}
                                                </p>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Rent: ₱{tenant.monthly_rent?.toLocaleString()}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">In: {tenant.date_moved_in} • Out: {tenant.contract_end_date}</p>
                                            </div>
                                        </td>

                                        {/* 3. Payment Info */}
                                        <td className="px-6 py-6">
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">
                                                    Balance: <span className={tenant.balance! > 0 ? 'text-rose-600' : 'text-emerald-600'}>₱{tenant.balance?.toLocaleString()}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Last Paid: {tenant.last_payment_date}</p>
                                                <span className={`mt-1.5 inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md ${
                                                    tenant.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                                                    tenant.payment_status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {tenant.payment_status}
                                                </span>
                                            </div>
                                        </td>

                                        {/* 4. Status */}
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border ${
                                                tenant.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                tenant.status === 'Moved Out' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {tenant.status}
                                            </span>
                                        </td>

                                        {/* 5. Actions */}
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(tenant)} className="px-4 py-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 rounded-lg transition-colors">
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteTenant(tenant.id)} 
                                                    disabled={isDeleting === tenant.id}
                                                    className="px-4 py-2 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {isDeleting === tenant.id ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}