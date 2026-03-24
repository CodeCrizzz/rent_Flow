const db = require('../config/db');
const bcrypt = require('bcryptjs');

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

// @desc    Create a new Tenant (Admin Only)
// @route   POST /api/admin/tenants
const createTenant = async (req, res) => {
    const { name, email, phone, password, room_id } = req.body;

    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || 'password123', salt);

        const newUser = await db.query(
            'INSERT INTO users (name, email, phone, password, role, room_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, phone, room_id',
            [name, email, phone, hashedPassword, 'tenant', room_id || null]
        );

        res.status(201).json({
            message: 'Tenant created successfully',
            tenant: newUser.rows[0]
        });
    } catch (error) {
        console.error('Create Tenant Error:', error);
        res.status(500).json({ message: 'Server error during tenant creation' });
    }
};

// @desc    Update Tenant details
// @route   PUT /api/admin/tenants/:id
const updateTenant = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, room_id } = req.body;

    try {
        const query = `
            UPDATE users 
            SET name = $1, email = $2, phone = $3, room_id = $4 
            WHERE id = $5 AND role = 'tenant'
            RETURNING id, name, email, phone, room_id
        `;
        const result = await db.query(query, [name, email, phone, room_id || null, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        res.status(200).json({ message: 'Tenant updated successfully', tenant: result.rows[0] });
    } catch (error) {
        console.error('Update Tenant Error:', error);
        res.status(500).json({ message: 'Server error updating tenant' });
    }
};

// @desc    Delete a Tenant
// @route   DELETE /api/admin/tenants/:id
const deleteTenant = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query("DELETE FROM users WHERE id = $1 AND role = 'tenant' RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        res.status(200).json({ message: 'Tenant deleted successfully' });
    } catch (error) {
        console.error('Delete Tenant Error:', error);
        res.status(500).json({ message: 'Server error deleting tenant. Check for existing dependencies (payments, etc.).' });
    }
};

module.exports = { 
    getDashboardStats, 
    getAllRooms, 
    getAllTenants, 
    getAllPayments, 
    getAllRequests, 
    updateTenant, 
    deleteTenant,
    createTenant
};