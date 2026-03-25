"use client";
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { Bill, BillFormData, PaymentFormData } from '@/types/billing';

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
    const [billDetails, setBillDetails] = useState<Bill | null>(null); // detailed view with payments

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
        setBillDetails(null); // setup loading state
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
            amount_paid: Number(bill.balance)
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
            case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Unpaid': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'Partial': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Overdue': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing & Payments</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage tenant invoices, record payments, and track balances.</p>
                </div>
                <button 
                    onClick={() => { setBillForm(initialBillForm); setIsCreateOpen(true); }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                    ➕ Create Bill
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    placeholder="Search by Tenant Name..." 
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident / Unit</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Billing Month</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">Loading bills...</td></tr>
                            ) : filteredBills.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No billing records found.</td></tr>
                            ) : (
                                filteredBills.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{b.tenant_name}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Rm {b.room_number || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{b.billing_month}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{new Date(b.due_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-black text-slate-900">₱ {Number(b.total_amount).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-black">
                                            <span className={Number(b.balance) > 0 ? "text-rose-600" : "text-emerald-600"}>
                                                ₱ {Number(b.balance).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${getStatusStyles(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openViewModal(b)} className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition" title="View Details">👁️ View</button>
                                                {b.status !== 'Paid' && (
                                                    <button onClick={() => openPayModal(b)} className="px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Record Payment">💵 Pay</button>
                                                )}
                                                <button onClick={() => openEditModal(b)} className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Edit Bill">✏️ Edit</button>
                                                <button onClick={() => handleDeleteBill(b.id)} className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete Bill">🗑️</button>
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
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">{isEditOpen ? 'Edit Bill' : 'Create New Bill'}</h2>
                            <button onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
                        </div>
                        <form onSubmit={isEditOpen ? handleEditSubmit : handleCreateSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tenant</label>
                                    <select required disabled={isEditOpen} value={billForm.tenant_id} onChange={(e) => handleTenantChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 font-medium">
                                        <option value="" disabled>Select Tenant</option>
                                        {tenants.map(t => <option key={t.id} value={t.id}>{t.name} (Rm {rooms.find(r=>r.id===t.room_id)?.room_number})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Billing Month</label>
                                    <input required type="text" placeholder="e.g. March 2026" value={billForm.billing_month} onChange={e => setBillForm({...billForm, billing_month: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</label>
                                    <input required type="date" value={billForm.due_date} onChange={e => setBillForm({...billForm, due_date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rent Amount (₱)</label>
                                    <input required type="number" step="0.01" value={billForm.rent_amount} onChange={e => setBillForm({...billForm, rent_amount: parseFloat(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Water Charges (₱)</label>
                                    <input required type="number" step="0.01" value={billForm.water_charges} onChange={e => setBillForm({...billForm, water_charges: parseFloat(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Electricity Charges (₱)</label>
                                    <input required type="number" step="0.01" value={billForm.electricity_charges} onChange={e => setBillForm({...billForm, electricity_charges: parseFloat(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Other Fees (₱)</label>
                                    <input required type="number" step="0.01" value={billForm.other_fees} onChange={e => setBillForm({...billForm, other_fees: parseFloat(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
                                        <span className="font-bold text-indigo-900">Total Calculated Amount</span>
                                        <span className="text-2xl font-black text-indigo-600">₱ {Number((Number(billForm.rent_amount) || 0) + (Number(billForm.water_charges) || 0) + (Number(billForm.electricity_charges) || 0) + (Number(billForm.other_fees) || 0)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition">Cancel</button>
                                <button type="submit" className="px-6 py-3 font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">Save Bill</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pay Bill Modal */}
            {isPayOpen && selectedBill && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">Record Payment</h2>
                            <button onClick={() => setIsPayOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
                        </div>
                        <form onSubmit={handlePaySubmit} className="p-8 space-y-5">
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-6">
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Remaining Balance</p>
                                <p className="text-2xl font-black text-amber-700">₱ {Number(selectedBill.balance).toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount Paid (₱)</label>
                                <input required type="number" step="0.01" max={Number(selectedBill.balance)} value={paymentForm.amount_paid} onChange={e => setPaymentForm({...paymentForm, amount_paid: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-lg text-emerald-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Method</label>
                                <select required value={paymentForm.payment_method} onChange={e => setPaymentForm({...paymentForm, payment_method: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium">
                                    <option value="Cash">Cash</option>
                                    <option value="GCash">GCash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Date</label>
                                <input required type="date" value={paymentForm.payment_date} onChange={e => setPaymentForm({...paymentForm, payment_date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium" />
                            </div>
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsPayOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition">Cancel</button>
                                <button type="submit" className="px-6 py-3 font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition">Confirm Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewOpen && selectedBill && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Billing Details</h2>
                                <p className="text-slate-500 font-medium mt-1">Invoice for {selectedBill.billing_month}</p>
                            </div>
                            <button onClick={() => setIsViewOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto">
                            {!billDetails ? (
                                <div className="py-20 text-center"><p className="text-slate-400 font-bold">Loading details...</p></div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Top Summary */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-xl text-slate-900">{billDetails.tenant_name}</p>
                                            <p className="text-slate-500 font-medium">Room {billDetails.room_number || 'N/A'}</p>
                                            <p className="text-sm text-slate-400 mt-1">Due: {new Date(billDetails.due_date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl border inline-block mb-3 ${getStatusStyles(billDetails.status)}`}>
                                                {billDetails.status}
                                            </span>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                                            <p className="text-4xl font-black text-slate-900 tracking-tight">₱ {Number(billDetails.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Breakdown */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Charges Breakdown</h3>
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
                                            <div className="flex justify-between text-sm font-medium text-slate-600"><span>Rent</span><span>₱ {Number(billDetails.rent_amount).toLocaleString()}</span></div>
                                            <div className="flex justify-between text-sm font-medium text-slate-600"><span>Electricity</span><span>₱ {Number(billDetails.electricity_charges).toLocaleString()}</span></div>
                                            <div className="flex justify-between text-sm font-medium text-slate-600"><span>Water</span><span>₱ {Number(billDetails.water_charges).toLocaleString()}</span></div>
                                            <div className="flex justify-between text-sm font-medium text-slate-600"><span>Other Fees</span><span>₱ {Number(billDetails.other_fees).toLocaleString()}</span></div>
                                            <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between font-black text-slate-900"><span>Total</span><span>₱ {Number(billDetails.total_amount).toLocaleString()}</span></div>
                                        </div>
                                    </div>

                                    {/* Payment History */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Payment History</h3>
                                        {billDetails.payments && billDetails.payments.length > 0 ? (
                                            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                                                {billDetails.payments.map(p => (
                                                    <div key={p.id} className="p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition">
                                                        <div>
                                                            <p className="font-bold text-slate-900">{new Date(p.payment_date).toLocaleDateString()}</p>
                                                            <p className="text-xs font-medium text-slate-500">{p.payment_method}</p>
                                                        </div>
                                                        <p className="font-black text-emerald-600">₱ {Number(p.amount_paid).toLocaleString()}</p>
                                                    </div>
                                                ))}
                                                <div className="p-4 bg-slate-50 flex justify-between items-center border-t border-slate-200">
                                                    <p className="font-bold text-slate-700">Total Paid</p>
                                                    <p className="font-black text-slate-900">₱ {Number(billDetails.amount_paid).toLocaleString()}</p>
                                                </div>
                                                <div className="p-4 bg-amber-50 flex justify-between items-center border-t border-amber-100">
                                                    <p className="font-bold text-amber-900">Remaining Balance</p>
                                                    <p className="font-black text-amber-700">₱ {Number(billDetails.balance).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 text-slate-500 font-medium">
                                                No payments have been made for this bill yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button onClick={() => setIsViewOpen(false)} className="px-6 py-3 font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}