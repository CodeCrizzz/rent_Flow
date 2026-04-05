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
    address?: string;
    id_document?: string;
    bed_space?: string;
    date_moved_in?: string;
    contract_end_date?: string;
    monthly_rent?: number;
    payment_status?: 'Paid' | 'Unpaid' | 'Overdue';
    last_payment_date?: string;
    balance?: number;
    status: 'Active' | 'Inactive' | 'Moved Out' | 'Pending' | 'Declined';
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
    const [statusFilter, setStatusFilter] = useState('All');
    const [error, setError] = useState('');
    
    // --- MODAL & FORM STATES ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isStatusUpdating, setIsStatusUpdating] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        room_id: '' as string | number,
        address: '',
        gender: '',
        monthly_rent: '',
        date_moved_in: '',
        contract_end_date: '',
        status: 'Pending'
    });

    const fetchTenants = async () => {
        try {
            const { data } = await api.get('/admin/tenants');
            
            const enrichedData = data.map((t: any) => ({
                ...t,
                gender: t.gender || 'Not Specified',
                address: t.address || '',
                id_document: t.id_document ? 'Verified' : 'Pending',
                bed_space: t.bed_space || 'N/A',
                date_moved_in: t.date_moved_in ? new Date(t.date_moved_in).toISOString().split('T')[0] : '', 
                contract_end_date: t.contract_end_date ? new Date(t.contract_end_date).toISOString().split('T')[0] : '', 
                monthly_rent: t.monthly_rent || 0,
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

    const handleOpenModal = (tenant?: Tenant, intention: 'approve' | 'edit' = 'edit') => {
        if (tenant) {
            setEditingTenant(tenant);
            setFormData({
                name: tenant.name,
                email: tenant.email,
                phone: tenant.phone || '',
                password: '', 
                room_id: tenant.room_id?.toString() ?? '',
                address: tenant.address || '',
                gender: tenant.gender || '',
                monthly_rent: tenant.monthly_rent?.toString() || '',
                date_moved_in: tenant.date_moved_in || '',
                contract_end_date: tenant.contract_end_date || '',
                status: intention === 'approve' ? 'Active' : tenant.status
            });
        } else {
            setEditingTenant(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                room_id: '',
                address: '',
                gender: '',
                monthly_rent: '',
                date_moved_in: '',
                contract_end_date: '',
                status: 'Pending'
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

    const handleUpdateStatus = async (id: number, status: string) => {
        setIsStatusUpdating(id);
        setError('');
        try {
            await api.put(`/admin/tenants/${id}`, { status });
            fetchTenants();
        } catch (err: any) {
             console.error(`Failed to update status to ${status}:`, err);
             setError(`Failed to set status to ${status}.`);
        } finally {
             setIsStatusUpdating(null);
        }
    };

    const filteredTenants = tenants.filter(t => 
        (statusFilter === 'All' || t.status === statusFilter) &&
        (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.room_number && t.room_number.toString().includes(searchQuery)))
    );

    const getTenantStatusStyles = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
            case 'Pending': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
            case 'Declined': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
            case 'Moved Out': return 'bg-slate-50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-500/20';
            default: return 'bg-slate-50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-500/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 relative pb-20">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-10 w-96 h-96 bg-[#5b21b6]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute top-40 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Tenants Directory</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2">Manage all active residents and pending applications.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)} 
                        className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent shadow-sm appearance-none outline-none w-full sm:w-40"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Declined">Declined</option>
                        <option value="Moved Out">Moved Out</option>
                    </select>
                    <div className="relative group w-full sm:w-80">
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Search residents..." 
                            className="pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent w-full shadow-sm transition-all outline-none" 
                        />
                        <svg className="w-5 h-5 text-slate-500 dark:text-zinc-500 absolute left-4 top-3.5 group-focus-within:text-[#5b21b6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <button onClick={() => handleOpenModal()} className="px-6 py-3.5 bg-[#5b21b6] text-white font-bold rounded-xl hover:bg-[#4c1d95] transition-all shadow-[0_0_20px_rgba(91,33,182,0.4)] text-sm flex items-center justify-center gap-2 group w-full sm:w-auto">
                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                        Add Resident
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 font-bold text-sm flex items-center gap-3 relative z-10">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    {error}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{editingTenant ? 'Edit Resident' : 'Add New Resident'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Full Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" placeholder="e.g. John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Email Address</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Phone Number</label>
                                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" placeholder="+63 000 000 0000" />
                                </div>
                            </div>
                            {!editingTenant && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Account Password</label>
                                    <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" placeholder="••••••••" />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-6 mt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Gender</label>
                                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none appearance-none">
                                        <option value="">Not Specified</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Tenant Status</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none appearance-none">
                                        <option value="Pending">Pending</option>
                                        <option value="Active">Active</option>
                                        <option value="Declined">Declined</option>
                                        <option value="Moved Out">Moved Out</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Home Address</label>
                                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" placeholder="123 Main St..." />
                            </div>

                            <div className="pt-4 pb-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Rental Details</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Assigned Unit</label>
                                    <select 
                                        value={formData.room_id?.toString() || ''} 
                                        onChange={e => setFormData({...formData, room_id: e.target.value})} 
                                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none appearance-none"
                                    >
                                        <option value="">Unassigned / Pending</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id.toString()}>Room {room.room_number} ({room.status})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Monthly Rent (₱)</label>
                                    <input type="number" min="0" step="0.01" value={formData.monthly_rent} onChange={e => setFormData({...formData, monthly_rent: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" placeholder="e.g. 5000" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Move-in Date</label>
                                    <input type="date" value={formData.date_moved_in} onChange={e => setFormData({...formData, date_moved_in: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Contract End Date</label>
                                    <input type="date" value={formData.contract_end_date} onChange={e => setFormData({...formData, contract_end_date: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-5 py-3.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-zinc-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:text-white rounded-xl transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-3.5 font-bold bg-[#5b21b6] text-white rounded-xl hover:bg-[#4c1d95] transition-colors shadow-lg flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        editingTenant ? 'Update Records' : 'Register Resident'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative z-10">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-zinc-900/50">
                            <tr className="border-b border-slate-200 dark:border-zinc-800">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Resident Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Rental Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Financials</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="w-6 h-6 border-2 border-[#5b21b6]/20 border-t-[#5b21b6] rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Fetching residents...</p>
                                    </td>
                                </tr>
                            ) : filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-slate-500 dark:text-zinc-500 font-bold text-sm">
                                        {searchQuery ? "No residents match your search." : "No residents found."}
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-indigo-50/50 dark:hover:bg-zinc-900/40 transition-colors group">
                                        
                                        {/* 1. Basic Information */}
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 font-bold text-sm group-hover:bg-[#5b21b6] group-hover:text-white group-hover:border-[#5b21b6] transition-all duration-300 shrink-0">
                                                    {tenant.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{tenant.name}</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium mt-0.5">{tenant.email} • {tenant.phone}</p>
                                                    <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">Gender: {tenant.gender} • ID: {tenant.id_document}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 2. Room & Rental Info */}
                                        <td className="px-8 py-5">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {tenant.room_number ? `Room ${tenant.room_number}` : 'Unassigned'} 
                                                    {tenant.bed_space !== 'N/A' && ` • Bed ${tenant.bed_space}`}
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Rent: ₱{tenant.monthly_rent ? Number(tenant.monthly_rent).toLocaleString() : '0'}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                                    In: {tenant.date_moved_in ? new Date(tenant.date_moved_in).toLocaleDateString() : 'N/A'} • 
                                                    Out: {tenant.contract_end_date ? new Date(tenant.contract_end_date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </td>

                                        {/* 3. Payment Info */}
                                        <td className="px-8 py-5">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">
                                                    Balance: <span className={tenant.balance! > 0 ? 'text-rose-400' : 'text-emerald-400'}>₱{tenant.balance?.toLocaleString()}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Last Paid: {tenant.last_payment_date}</p>
                                                <span className={`mt-1.5 inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md border ${
                                                    tenant.payment_status === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                                                    tenant.payment_status === 'Overdue' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' : 'bg-slate-50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-500/20'
                                                }`}>
                                                    {tenant.payment_status}
                                                </span>
                                            </div>
                                        </td>

                                        {/* 4. Status */}
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border ${getTenantStatusStyles(tenant.status)}`}>
                                                {tenant.status}
                                            </span>
                                        </td>

                                        {/* 5. Actions */}
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {tenant.status === 'Pending' ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(tenant.id, 'Active')} 
                                                            disabled={isStatusUpdating === tenant.id} 
                                                            className="px-3 py-1.5 text-emerald-400 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400/10 rounded-lg transition-colors disabled:opacity-50"
                                                        >
                                                            {isStatusUpdating === tenant.id ? '...' : 'Approve'}
                                                        </button>
                                                        
                                                        <button onClick={() => handleUpdateStatus(tenant.id, 'Declined')} disabled={isStatusUpdating === tenant.id} className="px-3 py-1.5 text-amber-400 font-black text-[10px] uppercase tracking-widest hover:bg-amber-400/10 rounded-lg transition-colors disabled:opacity-50">
                                                            {isStatusUpdating === tenant.id ? '...' : 'Decline'}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleOpenModal(tenant, 'edit')} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" title="Edit Tenant">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDeleteTenant(tenant.id)} 
                                                    disabled={isDeleting === tenant.id}
                                                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete Tenant"
                                                >
                                                    {isDeleting === tenant.id ? (
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">...</span>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    )}
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