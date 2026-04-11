const db = require('../config/db');

// Get Tenant Dashboard Data
const getTenantDashboard = async (req, res) => {
    const tenantId = req.user.id; // Extracted from the JWT token!

    try {
        // Get tenant's current status and room
        const userResult = await db.query(
            "SELECT u.status, r.room_number FROM users u LEFT JOIN rooms r ON u.room_id = r.id WHERE u.id = $1",
            [tenantId]
        );
        const user = userResult.rows[0];

        // Get total pending balance for THIS specific tenant
        const balanceResult = await db.query(
            "SELECT SUM(balance) FROM bills WHERE tenant_id = $1 AND status != 'Paid'", 
            [tenantId]
        );

        // Get recent payment history
        // Modified to handle both charges (bills) and payments if needed, but for now focusing on bills/payments joined
        const historyResult = await db.query(
            "SELECT p.*, b.billing_month FROM payments p JOIN bills b ON p.bill_id = b.id WHERE b.tenant_id = $1 ORDER BY p.payment_date DESC LIMIT 5",
            [tenantId]
        );

        res.status(200).json({
            status: user.status,
            roomNumber: user.room_number,
            balanceDue: balanceResult.rows[0].sum || 0,
            recentTransactions: historyResult.rows
        });
    } catch (error) {
        console.error('Tenant Dashboard Error:', error);
        res.status(500).json({ message: 'Server error fetching tenant stats' });
    }
};

// Get Tenant Profile & Room Info
const getTenantProfile = async (req, res) => {
    const tenantId = req.user.id;
    try {
        const result = await db.query(
            `SELECT u.name, u.email, u.phone, r.room_number, r.capacity, r.price 
             FROM users u 
             LEFT JOIN rooms r ON u.room_id = r.id 
             WHERE u.id = $1`,
            [tenantId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

// Submit Maintenance Request
const submitRequest = async (req, res) => {
    const { title, description } = req.body;
    const tenantId = req.user.id;
    try {
        await db.query(
            'INSERT INTO requests (tenant_id, title, description) VALUES ($1, $2, $3)',
            [tenantId, title, description]
        );
        res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error submitting request' });
    }
};

// @Get Tenant's Own Requests
const getMyRequests = async (req, res) => {
    const tenantId = req.user.id;
    try {
        const result = await db.query(
            'SELECT * FROM requests WHERE tenant_id = $1 ORDER BY created_at DESC',
            [tenantId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching requests' });
    }
};

//Get Tenant Payments
const getTenantPayments = async (req, res) => {
    const tenantId = req.user.id;
    try {
        const result = await db.query(
            "SELECT id, TO_CHAR(due_date, 'YYYY-MM-DD') AS date, billing_month || ' Bill' AS description, total_amount AS amount, LOWER(status) AS status FROM bills WHERE tenant_id = $1 ORDER BY due_date DESC",
            [tenantId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Tenant Payments Error:', error);
        res.status(500).json({ message: 'Server error fetching payments' });
    }
};

//Get Tenant Messages
const getTenantMessages = async (req, res) => {
    const tenantId = req.user.id;
    try {
        const query = `
            SELECT * FROM messages 
            WHERE (sender_id = $1 AND receiver_id = 1) 
               OR (sender_id = 1 AND receiver_id = $1)
            ORDER BY created_at ASC
        `;
        const result = await db.query(query, [tenantId]);
        
        // Mark unread messages from Admin as read
        await db.query(`
            UPDATE messages 
            SET status = 'read' 
            WHERE sender_id = 1 AND receiver_id = $1 AND status != 'read'
        `, [tenantId]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
};

//Send Message to Admin
const sendTenantMessage = async (req, res) => {
    const tenantId = req.user.id;
    const { message } = req.body;
    
    if (!message) return res.status(400).json({ message: 'Message is required' });

    try {
        const adminId = 1; // Assuming admin user ID is 1
        const query = `
            INSERT INTO messages (sender_id, receiver_id, message, sender_type, status) 
            VALUES ($1, $2, $3, 'tenant', 'sent') 
            RETURNING *;
        `;
        const result = await db.query(query, [tenantId, adminId, message]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ message: 'Server error sending message' });
    }
};

//Get Unread Messages Count
const getUnreadCount = async (req, res) => {
    const tenantId = req.user.id;
    try {
        const result = await db.query(
            "SELECT COUNT(*) FROM messages WHERE receiver_id = $1 AND status != 'read'",
            [tenantId]
        );
        res.status(200).json({ unreadCount: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Unread Count Error:', error);
        res.status(500).json({ message: 'Server error fetching unread count' });
    }
};

// Update Tenant Profile
const updateTenantProfile = async (req, res) => {
    const tenantId = req.user.id;
    const { name, email, phone } = req.body;
    try {
        const result = await db.query(
            "UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, phone",
            [name, email, phone, tenantId]
        );
        res.status(200).json({ message: 'Profile updated successfully', user: result.rows[0] });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// Update Tenant Password
const updateTenantPassword = async (req, res) => {
    const tenantId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    try {
        const userResult = await db.query("SELECT password FROM users WHERE id = $1", [tenantId]);
        const user = userResult.rows[0];

        // Direct compare
        if (currentPassword !== user.password) return res.status(401).json({ message: 'Incorrect current password' });

        const hashedPassword = newPassword; // plain text

        await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, tenantId]);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating password' });
    }
};

// Get Tenant's Current Bill
const getCurrentBill = async (req, res) => {
    const tenantId = req.user.id;
    try {
        const result = await db.query(
            "SELECT id, billing_month, total_amount, amount_paid, balance, TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date, status FROM bills WHERE tenant_id = $1 AND status != 'Paid' ORDER BY due_date ASC LIMIT 1",
            [tenantId]
        );

        if (result.rows.length === 0) {
            const now = new Date();
            const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
            return res.status(200).json({
                month: currentMonthName,
                dueDate: null,
                totalAmount: 0,
                amountPaid: 0,
                remainingBalance: 0,
                status: "Clear",
                createdAt: user.created_at,
                creationDay: new Date(user.created_at).getDate()
            });
        }

        const bill = result.rows[0];
        // Map snake_case from DB to camelCase for the frontend page.tsx
        res.status(200).json({
            id: bill.id,
            month: bill.billing_month,
            totalAmount: parseFloat(bill.total_amount),
            amountPaid: parseFloat(bill.amount_paid),
            remainingBalance: parseFloat(bill.balance),
            dueDate: bill.due_date,
            status: bill.status,
            breakdown: { 
                rent: parseFloat(bill.total_amount), 
                water: 0, 
                electricity: 0, 
                other: 0 
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching current bill' });
    }
};

// Submit Proof of Payment
const submitTenantPayment = async (req, res) => {
    const tenantId = req.user.id;
    const { bill_id, amount_paid, payment_method, notes } = req.body;
    const proof_url = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const query = `
            INSERT INTO payments (bill_id, amount_paid, payment_date, payment_method, notes, proof_url, status) 
            VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5, 'Pending Verification') 
            RETURNING *
        `;
        const result = await db.query(query, [bill_id, amount_paid, payment_method, notes, proof_url]);
        res.status(201).json({ message: 'Payment proof submitted for verification', payment: result.rows[0] });
    } catch (error) {
        console.error('Submit Payment Error:', error);
        res.status(500).json({ message: 'Server error submitting payment proof' });
    }
};

module.exports = { 
    getTenantDashboard, getTenantProfile, updateTenantProfile, updateTenantPassword, 
    submitRequest, getMyRequests, getTenantPayments, getCurrentBill, submitTenantPayment,
    getTenantMessages, sendTenantMessage, getUnreadCount 
};