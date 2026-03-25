const db = require('../config/db');

// @desc    Get Tenant Dashboard Data
// @route   GET /api/tenant/dashboard
const getTenantDashboard = async (req, res) => {
    const tenantId = req.user.id; // Extracted from the JWT token!

    try {
        // 1. Get total pending balance for THIS specific tenant
        const balanceResult = await db.query(
            "SELECT SUM(balance) FROM bills WHERE tenant_id = $1 AND status != 'Paid'", 
            [tenantId]
        );

        // 2. Get recent payment history
        const historyResult = await db.query(
            "SELECT p.*, b.billing_month FROM payments p JOIN bills b ON p.bill_id = b.id WHERE b.tenant_id = $1 ORDER BY p.payment_date DESC LIMIT 5",
            [tenantId]
        );

        res.status(200).json({
            balanceDue: balanceResult.rows[0].sum || 0,
            recentTransactions: historyResult.rows
        });
    } catch (error) {
        console.error('Tenant Dashboard Error:', error);
        res.status(500).json({ message: 'Server error fetching tenant stats' });
    }
};

// @desc    Get Tenant Profile & Room In    fo
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

// @desc    Submit Maintenance Request
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

// @desc    Get Tenant's Own Requests
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

// @desc    Get Tenant Payments
const getTenantPayments = async (req, res) => {
    const tenantId = req.user.id;
    try {
        const result = await db.query(
            "SELECT id, due_date, billing_month || ' Bill' AS description, total_amount AS amount, LOWER(status) AS status FROM bills WHERE tenant_id = $1 ORDER BY due_date DESC",
            [tenantId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Tenant Payments Error:', error);
        res.status(500).json({ message: 'Server error fetching payments' });
    }
};

// @desc    Get Tenant Messages
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

// @desc    Send Message to Admin
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

module.exports = { 
    getTenantDashboard, getTenantProfile, submitRequest, 
    getMyRequests, getTenantPayments, getTenantMessages, sendTenantMessage 
};