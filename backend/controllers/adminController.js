const db = require('../config/db');

// @desc    Get Admin Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        const roomsResult = await db.query('SELECT COUNT(*) FROM rooms');
        const tenantsResult = await db.query("SELECT COUNT(*) FROM users WHERE role = 'tenant'");
        const paymentsResult = await db.query("SELECT SUM(amount) FROM payments WHERE status = 'pending'");

        res.status(200).json({
            totalRooms: parseInt(roomsResult.rows[0].count),
            activeTenants: parseInt(tenantsResult.rows[0].count),
            pendingDues: paymentsResult.rows[0].sum || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching admin stats' });
    }
};

// @desc    Get all Rooms with their current tenant
// @route   GET /api/admin/rooms
const getAllRooms = async (req, res) => {
    try {
        // This query gets the room and tries to find a user assigned to it
        const query = `
            SELECT r.*, u.name as tenant_name 
            FROM rooms r 
            LEFT JOIN users u ON r.id = u.room_id
            ORDER BY r.room_number ASC
        `;
        const rooms = await db.query(query);
        res.status(200).json(rooms.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching rooms' });
    }
};

// @desc    Get all Tenants
// @route   GET /api/admin/tenants
const getAllTenants = async (req, res) => {
    try {
        // Fetch tenants and join with the rooms table to see their room number
        const query = `
            SELECT u.id, u.name, u.email, u.phone, u.created_at, r.room_number 
            FROM users u 
            LEFT JOIN rooms r ON u.room_id = r.id 
            WHERE u.role = 'tenant' 
            ORDER BY u.created_at DESC
        `;
        const tenants = await db.query(query);
        res.status(200).json(tenants.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching tenants' });
    }
};

// @desc    Get all Payments/Billing
const getAllPayments = async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.name as tenant_name, r.room_number 
            FROM payments p 
            JOIN users u ON p.tenant_id = u.id 
            LEFT JOIN rooms r ON u.room_id = r.id 
            ORDER BY p.due_date DESC
        `;
        const payments = await db.query(query);
        res.status(200).json(payments.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching payments' });
    }
};

// @desc    Get all Maintenance Requests
const getAllRequests = async (req, res) => {
    try {
        const query = `
            SELECT req.*, u.name as tenant_name, r.room_number 
            FROM requests req 
            JOIN users u ON req.tenant_id = u.id 
            LEFT JOIN rooms r ON u.room_id = r.id 
            ORDER BY req.created_at DESC
        `;
        const requests = await db.query(query);
        res.status(200).json(requests.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching requests' });
    }
};

module.exports = { getDashboardStats, getAllRooms, getAllTenants, getAllPayments, getAllRequests };