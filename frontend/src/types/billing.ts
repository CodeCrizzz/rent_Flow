export interface Bill {
    id: number;
    tenant_id: number;
    room_id: number | null;
    tenant_name: string;
    room_number: string | null;
    tenant_email?: string;
    tenant_phone?: string;
    billing_month: string;
    due_date: string;
    rent_amount: string | number;
    water_charges: string | number;
    electricity_charges: string | number;
    other_fees: string | number;
    total_amount: string | number;
    amount_paid: string | number;
    balance: string | number;
    status: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
    notes?: string;
    created_at: string;
    payments?: Payment[]; // when fetching single bill
}

export interface Payment {
    id: number;
    bill_id: number;
    amount_paid: string | number;
    payment_date: string;
    payment_method: string;
    notes?: string;
    created_at: string;
}

export interface BillFormData {
    tenant_id: number | '';
    room_id: number | '';
    billing_month: string;
    due_date: string;
    rent_amount: string | number;
    water_charges: string | number;
    electricity_charges: string | number;
    other_fees: string | number;
    notes: string;
}

export interface PaymentFormData {
    amount_paid: string | number;
    payment_date: string;
    payment_method: string;
    notes: string;
}
