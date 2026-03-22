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

module.exports = { getTenantDashboard };