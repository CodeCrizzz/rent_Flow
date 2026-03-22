const db = require('../config/db');

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
    try {
        // 1. Get Total Rooms
        const roomsResult = await db.query('SELECT COUNT(*) FROM rooms');
        
        // 2. Get Total Tenants
        const tenantsResult = await db.query("SELECT COUNT(*) FROM users WHERE role = 'tenant'");
        
        // 3. Get Total Pending Payments
        const paymentsResult = await db.query("SELECT SUM(amount) FROM payments WHERE status = 'pending'");

        res.status(200).json({
            totalRooms: parseInt(roomsResult.rows[0].count),
            activeTenants: parseInt(tenantsResult.rows[0].count),
            pendingDues: paymentsResult.rows[0].sum || 0
        });
    } catch (error) {
        console.error('Admin Dashboard Error:', error);
        res.status(500).json({ message: 'Server error fetching admin stats' });
    }
};

// @desc    Get all Tenants
// @route   GET /api/admin/tenants
const getAllTenants = async (req, res) => {
    try {
        const tenants = await db.query("SELECT id, name, email, created_at FROM users WHERE role = 'tenant' ORDER BY created_at DESC");
        res.status(200).json(tenants.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching tenants' });
    }
};

module.exports = { getDashboardStats, getAllTenants };