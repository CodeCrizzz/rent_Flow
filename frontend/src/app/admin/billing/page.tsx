"use client";
import { useEffect, useState, useMemo, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import api from '@/lib/api';
export interface Bill {
    id: number;
    tenant_id: number;
    tenant_name: string;
    room_id: number | null;
    room_number: string | null;
    billing_month: string;
    due_date: string;
    rent_amount: number;
    water_charges: number;
    electricity_charges: number;
    other_fees: number;
    total_amount: number;
    amount_paid: number;
    balance: number;
    status: string;
    notes: string | null;
    payments?: any[];
}

export interface BillFormData {
    tenant_id: number | '';
    room_id: number | '';
    billing_month: string;
    due_date: string;
    rent_amount: number;
    water_charges: number;
    electricity_charges: number;
    other_fees: number;
    notes: string;
}

export interface PaymentFormData {
    amount_paid: number | '';
    payment_date: string;
    payment_method: string;
    notes: string;
}

interface Tenant { id: number; name: string; room_id: number; }
interface Room { id: number; room_number: string; price: number; }

export default function AdminBilling() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Selected Bill Actions
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [billDetails, setBillDetails] = useState<Bill | null>(null);

    // Forms
    const initialBillForm: BillFormData = {
        tenant_id: '',
        room_id: '',
        billing_month: '',
        due_date: '',
        rent_amount: 0,
        water_charges: 0,
        electricity_charges: 0,
        other_fees: 0,
        notes: ''
    };
    const [billForm, setBillForm] = useState<BillFormData>(initialBillForm);

    const initialPaymentForm: PaymentFormData = {
        amount_paid: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        notes: ''
    };
    const [paymentForm, setPaymentForm] = useState<PaymentFormData>(initialPaymentForm);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [billsRes, tenantsRes, roomsRes] = await Promise.all([
                api.get('/admin/bills'),
                api.get('/admin/tenants'),
                api.get('/admin/rooms')
            ]);
            setBills(billsRes.data);
            setTenants(tenantsRes.data);
            setRooms(roomsRes.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredBills = useMemo(() => {
        return bills.filter(bill => {
            const matchesSearch = bill.tenant_name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "All" || bill.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [bills, searchQuery, statusFilter]);

    // Handlers
    const handleTenantChange = (tenantId: string) => {
        const tenant = tenants.find(t => t.id === Number(tenantId));
        setBillForm({
            ...billForm,
            tenant_id: Number(tenantId),
            room_id: tenant?.room_id || '',
            rent_amount: rooms.find(r => r.id === tenant?.room_id)?.price || 0
        });
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/bills', billForm);
            setIsCreateOpen(false);
            setBillForm(initialBillForm);
            fetchData();
        } catch (error) {
            console.error("Create bill failed:", error);
            alert("Failed to create bill.");
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBill) return;
        try {
            await api.put(`/admin/bills/${selectedBill.id}`, billForm);
            setIsEditOpen(false);
            fetchData();
        } catch (error) {
            console.error("Edit bill failed:", error);
            alert("Failed to edit bill.");
        }
    };

    const handlePaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBill) return;
        try {
            await api.post(`/admin/bills/${selectedBill.id}/pay`, paymentForm);
            setIsPayOpen(false);
            setPaymentForm(initialPaymentForm);
            fetchData();
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Failed to record payment.");
        }
    };

    const openViewModal = async (bill: Bill) => {
        setSelectedBill(bill);
        setIsViewOpen(true);
        setBillDetails(null);
        try {
            const { data } = await api.get(`/admin/bills/${bill.id}`);
            setBillDetails(data);
        } catch (error) {
            console.error("Fetch bill details failed");
        }
    };

    const openEditModal = (bill: Bill) => {
        setSelectedBill(bill);
        setBillForm({
            tenant_id: bill.tenant_id,
            room_id: bill.room_id || '',
            billing_month: bill.billing_month,
            due_date: new Date(bill.due_date).toISOString().split('T')[0],
            rent_amount: bill.rent_amount,
            water_charges: bill.water_charges,
            electricity_charges: bill.electricity_charges,
            other_fees: bill.other_fees,
            notes: bill.notes || ''
        });
        setIsEditOpen(true);
    };

    const openPayModal = (bill: Bill) => {
        setSelectedBill(bill);
        setPaymentForm({
            ...initialPaymentForm,
            amount_paid: Number(bill.balance) || ''
        });
        setIsPayOpen(true);
    };

    const handleDeleteBill = async (id: number) => {
        if (!confirm("Are you sure you want to delete this bill? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/bills/${id}`);
            fetchData();
        } catch (error) {
            console.error("Delete failed");
            alert("Failed to delete bill.");
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
            case 'Unpaid': return 'bg-slate-50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-500/20';
            case 'Partial': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
            case 'Overdue': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
            default: return 'bg-slate-50 dark:bg-zinc-500/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-500/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 relative">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-10 w-96 h-96 bg-[#5b21b6]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute top-40 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Billing & Payments</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2">Manage tenant invoices, record payments, and track balances.</p>
                </div>
                <button 
                    onClick={() => { setBillForm(initialBillForm); setIsCreateOpen(true); }}
                    className="bg-[#5b21b6] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#4c1d95] transition-all shadow-[0_0_20px_rgba(91,33,182,0.4)] flex items-center gap-2 group"
                >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    Create Bill
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 dark:text-zinc-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by Tenant Name..." 
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select 
                    className="px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent transition-all appearance-none sm:w-48"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial</option>
                    <option value="Overdue">Overdue</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative z-10">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-zinc-900/50">
                            <tr className="border-b border-slate-200 dark:border-zinc-800">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Resident / Unit</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Billing Month</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Due Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Total</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Balance</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center">
                                        <div className="w-6 h-6 border-2 border-[#5b21b6]/20 border-t-[#5b21b6] rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Loading Records...</p>
                                    </td>
                                </tr>
                            ) : filteredBills.length === 0 ? (
                                <tr><td colSpan={7} className="px-8 py-16 text-center text-slate-500 dark:text-zinc-500 font-bold text-sm">No billing records found.</td></tr>
                            ) : (
                                filteredBills.map((b) => (
                                    <tr key={b.id} className="hover:bg-indigo-50/50 dark:hover:bg-zinc-900/40 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400 font-bold text-xs">
                                                    {b.tenant_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{b.tenant_name}</p>
                                                    <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Rm {b.room_number || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-zinc-300">{b.billing_month}</td>
                                        <td className="px-8 py-5 text-sm font-medium text-slate-500 dark:text-zinc-400">{new Date(b.due_date).toLocaleDateString()}</td>
                                        <td className="px-8 py-5 font-black text-slate-900 dark:text-white">₱ {Number(b.total_amount).toLocaleString()}</td>
                                        <td className="px-8 py-5 font-black">
                                            <span className={Number(b.balance) > 0 ? "text-rose-400" : "text-emerald-400"}>
                                                ₱ {Number(b.balance).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${getStatusStyles(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openViewModal(b)} className="p-2 text-slate-500 dark:text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="View Details">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                </button>
                                                {b.status !== 'Paid' && (
                                                    <button onClick={() => openPayModal(b)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Record Payment">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                    </button>
                                                )}
                                                <button onClick={() => openEditModal(b)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" title="Edit Bill">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={() => handleDeleteBill(b.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete Bill">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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

            {/* Create/Edit Bill Modal */}
            {(isCreateOpen || isEditOpen) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{isEditOpen ? 'Edit Bill' : 'Create New Bill'}</h2>
                            <button onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={isEditOpen ? handleEditSubmit : handleCreateSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Tenant</label>
                                    <select required disabled={isEditOpen} value={billForm.tenant_id} onChange={(e) => handleTenantChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent disabled:opacity-50 appearance-none outline-none">
                                        <option value="" disabled>Select Tenant</option>
                                        {tenants.map(t => <option key={t.id} value={t.id}>{t.name} (Rm {rooms.find(r=>r.id===t.room_id)?.room_number})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Billing Month</label>
                                    <input required type="text" placeholder="e.g. March 2026" value={billForm.billing_month} onChange={e => setBillForm({...billForm, billing_month: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Due Date</label>
                                    <input required type="date" value={billForm.due_date} onChange={e => setBillForm({...billForm, due_date: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Rent Amount (₱)</label>
                                    <input required type="number" step="0.01" value={billForm.rent_amount} onChange={e => setBillForm({...billForm, rent_amount: parseFloat(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Water Charges (₱)</label>
                                    <input required type="number" step="0.01" value={billForm.water_charges} onChange={e => setBillForm({...billForm, water_charges: parseFloat(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Electricity Charges (₱)</label>
                                    <input required type="number" step="0.01" value={billForm.electricity_charges} onChange={e => setBillForm({...billForm, electricity_charges: parseFloat(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Other Fees (₱)</label>
                                    <input required type="number" step="0.01" value={billForm.other_fees} onChange={e => setBillForm({...billForm, other_fees: parseFloat(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#5b21b6] focus:border-transparent outline-none" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <div className="bg-indigo-50 dark:bg-[#5b21b6]/10 p-5 rounded-2xl border border-indigo-100 dark:border-[#5b21b6]/20 flex justify-between items-center">
                                        <span className="font-bold text-[#5b21b6] dark:text-[#a78bfa] text-xs uppercase tracking-widest">Total Calculated Amount</span>
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">₱ {Number((Number(billForm.rent_amount) || 0) + (Number(billForm.water_charges) || 0) + (Number(billForm.electricity_charges) || 0) + (Number(billForm.other_fees) || 0)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-zinc-800">
                                <button type="button" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="px-6 py-3.5 font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:text-white rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3.5 font-bold bg-[#5b21b6] text-white rounded-xl hover:bg-[#4c1d95] transition-colors shadow-lg">Save Bill</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pay Bill Modal */}
            {isPayOpen && selectedBill && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Record Payment</h2>
                            <button onClick={() => setIsPayOpen(false)} className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handlePaySubmit} className="p-8 space-y-5">
                            <div className="bg-amber-500/10 rounded-2xl p-5 border border-amber-500/20 mb-6">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Remaining Balance</p>
                                <p className="text-3xl font-black text-amber-400">₱ {Number(selectedBill.balance).toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Amount Paid (₱)</label>
                                <input required type="number" step="0.01" max={Number(selectedBill.balance)} value={paymentForm.amount_paid} onChange={e => setPaymentForm({...paymentForm, amount_paid: e.target.value === '' ? '' : parseFloat(e.target.value)})} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-emerald-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent font-black text-lg outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Payment Method</label>
                                <select required value={paymentForm.payment_method} onChange={e => setPaymentForm({...paymentForm, payment_method: e.target.value})} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent font-medium appearance-none outline-none">
                                    <option value="Cash">Cash</option>
                                    <option value="GCash">GCash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Payment Date</label>
                                <input required type="date" value={paymentForm.payment_date} onChange={e => setPaymentForm({...paymentForm, payment_date: e.target.value})} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent font-medium outline-none" />
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-zinc-800">
                                <button type="button" onClick={() => setIsPayOpen(false)} className="px-6 py-3.5 font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:text-white rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3.5 font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors shadow-lg">Confirm Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewOpen && selectedBill && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        <div className="px-8 py-6 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Billing Details</h2>
                                <p className="text-slate-500 dark:text-zinc-500 font-medium mt-1">Invoice for {selectedBill.billing_month}</p>
                            </div>
                            <button onClick={() => setIsViewOpen(false)} className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            {!billDetails ? (
                                <div className="py-20 text-center"><p className="text-slate-500 dark:text-zinc-500 font-bold">Loading details...</p></div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Top Summary */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-black text-2xl text-slate-900 dark:text-white">{billDetails.tenant_name}</p>
                                            <p className="text-slate-500 dark:text-zinc-400 font-medium">Room {billDetails.room_number || 'N/A'}</p>
                                            <p className="text-sm text-slate-500 dark:text-zinc-500 mt-2 font-bold tracking-wide">Due: {new Date(billDetails.due_date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border inline-block mb-3 ${getStatusStyles(billDetails.status)}`}>
                                                {billDetails.status}
                                            </span>
                                            <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Total Amount</p>
                                            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₱ {Number(billDetails.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Breakdown */}
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            Charges Breakdown
                                        </h3>
                                        <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 space-y-4">
                                            <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-zinc-400"><span>Rent</span><span className="text-slate-900 dark:text-white">₱ {Number(billDetails.rent_amount).toLocaleString()}</span></div>
                                            <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-zinc-400"><span>Electricity</span><span className="text-slate-900 dark:text-white">₱ {Number(billDetails.electricity_charges).toLocaleString()}</span></div>
                                            <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-zinc-400"><span>Water</span><span className="text-slate-900 dark:text-white">₱ {Number(billDetails.water_charges).toLocaleString()}</span></div>
                                            <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-zinc-400"><span>Other Fees</span><span className="text-slate-900 dark:text-white">₱ {Number(billDetails.other_fees).toLocaleString()}</span></div>
                                            <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 mt-4 flex justify-between font-black text-slate-900 dark:text-white text-lg"><span>Total</span><span className="text-indigo-400">₱ {Number(billDetails.total_amount).toLocaleString()}</span></div>
                                        </div>
                                    </div>

                                    {/* Payment History */}
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            Payment History
                                        </h3>
                                        {billDetails.payments && billDetails.payments.length > 0 ? (
                                            <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
                                                {billDetails.payments.map((p: any) => (
                                                    <div key={p.id} className="p-5 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/30 hover:bg-indigo-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white">{new Date(p.payment_date).toLocaleDateString()}</p>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mt-1">{p.payment_method}</p>
                                                        </div>
                                                        <p className="font-black text-emerald-400 text-lg">₱ {Number(p.amount_paid).toLocaleString()}</p>
                                                    </div>
                                                ))}
                                                <div className="p-5 bg-slate-50 dark:bg-zinc-900/80 flex justify-between items-center border-t border-slate-200 dark:border-zinc-800">
                                                    <p className="font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest text-[10px]">Total Paid</p>
                                                    <p className="font-black text-slate-900 dark:text-white text-xl">₱ {Number(billDetails.amount_paid).toLocaleString()}</p>
                                                </div>
                                                <div className="p-5 bg-amber-500/5 flex justify-between items-center border-t border-amber-500/10">
                                                    <p className="font-bold text-amber-500 uppercase tracking-widest text-[10px]">Remaining Balance</p>
                                                    <p className="font-black text-amber-400 text-xl">₱ {Number(billDetails.balance).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-50 dark:bg-zinc-900/30 rounded-2xl p-6 text-center border border-slate-200 dark:border-zinc-800 border-dashed text-slate-500 dark:text-zinc-500 font-medium">
                                                No payments have been made for this bill yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex justify-end">
                            <button onClick={() => setIsViewOpen(false)} className="px-6 py-3.5 font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 rounded-xl transition-colors shadow-sm">Close Panel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}