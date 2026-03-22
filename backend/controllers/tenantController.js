const db = require('../config/db');

// @desc    Get Tenant Dashboard Data
// @route   GET /api/tenant/dashboard
const getTenantDashboard = async (req, res) => {
    const tenantId = req.user.id; // Extracted from the JWT token!

    try {
        // 1. Get total pending balance for THIS specific tenant
        const balanceResult = await db.query(
            "SELECT SUM(amount) FROM payments WHERE tenant_id = $1 AND status = 'pending'", 
            [tenantId]
        );

        // 2. Get recent payment history
        const historyResult = await db.query(
            "SELECT * FROM payments WHERE tenant_id = $1 ORDER BY payment_date DESC LIMIT 5",
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
            'SELECT * FROM payments WHERE tenant_id = $1 ORDER BY due_date DESC',
            [tenantId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching payments' });
    }
};

module.exports = { getTenantDashboard, getTenantProfile, submitRequest, getMyRequests, getTenantPayments };