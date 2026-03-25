const db = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get Admin Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        const roomsResult = await db.query('SELECT COUNT(*) FROM rooms');
        const tenantsResult = await db.query("SELECT COUNT(*) FROM users WHERE role = 'tenant'");
        const billsResult = await db.query("SELECT SUM(balance) FROM bills WHERE status IN ('Unpaid', 'Partial', 'Overdue')");

        res.status(200).json({
            totalRooms: parseInt(roomsResult.rows[0].count),
            activeTenants: parseInt(tenantsResult.rows[0].count),
            pendingDues: billsResult.rows[0].sum || 0
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: 'Server error fetching admin stats' });
    }
};

// @desc    Get all Rooms with detailed occupancy & financials
// @route   GET /api/admin/rooms
const getAllRooms = async (req, res) => {
    try {
        const query = `
            SELECT 
                r.id, r.room_number, r.capacity, r.price, r.status,
                r.type, r.floor, r.description,
                CAST(COUNT(u.id) AS INTEGER) as current_occupants,
                CAST((r.capacity - COUNT(u.id)) AS INTEGER) as available_slots,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', u.id,
                            'name', u.name,
                            'phone', u.phone,
                            'date_moved_in', u.date_moved_in,
                            'balance', COALESCE((
                                SELECT SUM(balance) FROM bills b 
                                WHERE b.tenant_id = u.id AND b.status IN ('Unpaid', 'Partial', 'Overdue')
                            ), 0)
                        )
                    ) FILTER (WHERE u.id IS NOT NULL), '[]'::json -- <--- CRITICAL FIX: Added ::json here
                ) as occupants
            FROM rooms r
            LEFT JOIN users u ON r.id = u.room_id AND u.role = 'tenant'
            GROUP BY r.id
            ORDER BY r.room_number ASC
        `;
        const rooms = await db.query(query);
        res.status(200).json(rooms.rows);
    } catch (error) {
        // This will print the exact SQL error to your backend terminal if it ever fails again
        console.error("Get All Rooms Error Details:", error.message); 
        res.status(500).json({ message: 'Server error fetching rooms' });
    }
};

// @desc    Create a new Room
// @route   POST /api/admin/rooms
const createRoom = async (req, res) => {
    const { room_number, type, capacity, price, floor, description, status } = req.body;
    try {
        // 1. Check if room number already exists to prevent duplicates
        const roomExists = await db.query('SELECT * FROM rooms WHERE room_number = $1', [room_number]);
        if (roomExists.rows.length > 0) {
            return res.status(400).json({ message: 'Room number already exists' });
        }

        // 2. Insert the new room
        const query = `
            INSERT INTO rooms (room_number, type, capacity, price, floor, description, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *
        `;
        const newRoom = await db.query(query, [
            room_number, 
            type || 'Single', 
            capacity, 
            price, 
            floor || null, 
            description || null, 
            status || 'Available'
        ]);
        
        res.status(201).json({ message: 'Room created successfully', room: newRoom.rows[0] });
    } catch (error) {
        console.error('Create Room Error:', error);
        res.status(500).json({ message: 'Server error creating room' });
    }
};

// @desc    Update a Room
// @route   PUT /api/admin/rooms/:id
const updateRoom = async (req, res) => {
    const { id } = req.params;
    const { room_number, type, capacity, price, floor, description, status } = req.body;
    
    try {
        const query = `
            UPDATE rooms 
            SET room_number = $1, type = $2, capacity = $3, price = $4, floor = $5, description = $6, status = $7 
            WHERE id = $8 
            RETURNING *
        `;
        const updatedRoom = await db.query(query, [
            room_number, 
            type || 'Single', 
            capacity, 
            price, 
            floor || null, 
            description || null, 
            status, 
            id
        ]);
        
        if (updatedRoom.rows.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room updated successfully', room: updatedRoom.rows[0] });
    } catch (error) {
        console.error('Update Room Error:', error);
        res.status(500).json({ message: 'Server error updating room' });
    }
};

// @desc    Delete a Room
// @route   DELETE /api/admin/rooms/:id
const deleteRoom = async (req, res) => {
    const { id } = req.params;
    
    try {
        // 1. Safety Check: Don't delete if an active tenant is still assigned to this room
        const tenantCheck = await db.query("SELECT * FROM users WHERE room_id = $1 AND role = 'tenant' AND status != 'Moved Out'", [id]);
        if (tenantCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Cannot delete this room because an active tenant is currently assigned to it.' });
        }

        // 2. Delete the room
        const result = await db.query('DELETE FROM rooms WHERE id = $1 RETURNING id', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Delete Room Error:', error);
        res.status(500).json({ message: 'Server error deleting room' });
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

// @desc    Get all Tenants
// @route   GET /api/admin/tenants
const getAllTenants = async (req, res) => {
    try {
        const query = `
            SELECT u.*, r.room_number 
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

// @desc    Update Tenant details or Status
// @route   PUT /api/admin/tenants/:id
const updateTenant = async (req, res) => {
    const { id } = req.params;

    try {
        // If ONLY updating the status (Approve/Decline button)
        if (req.body.status && Object.keys(req.body).length === 1) {
            const result = await db.query(
                "UPDATE users SET status = $1 WHERE id = $2 AND role = 'tenant' RETURNING *",
                [req.body.status, id]
            );
            return res.status(200).json({ message: 'Status updated', tenant: result.rows[0] });
        }

        const { name, email, phone, room_id, gender, date_moved_in, contract_end_date, status } = req.body;

        const query = `
            UPDATE users 
            SET 
                name = $1, 
                email = $2, 
                phone = $3, 
                room_id = $4,
                gender = $5,
                date_moved_in = $6,
                contract_end_date = $7,
                status = $8
            WHERE id = $9 AND role = 'tenant'
            RETURNING *
        `;
        
        const result = await db.query(query, [
            name, 
            email, 
            phone, 
            room_id || null, 
            gender || 'Not Specified',
            date_moved_in || null,
            contract_end_date || null,
            status || 'Pending',
            id
        ]);

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

// @desc    Get all Messages (Admin Chat)
// @route   GET /api/admin/chat
const getMessages = async (req, res) => {
    try {
        const { tenant_id } = req.query;
        
        if (!tenant_id) {
            return res.status(400).json({ message: 'Tenant ID is required' });
        }

        const query = `
            SELECT * FROM messages 
            WHERE (sender_id = $1 AND receiver_id = 1) 
               OR (sender_id = 1 AND receiver_id = $1)
            ORDER BY created_at ASC
        `;
        const result = await db.query(query, [tenant_id]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
};

// @desc    Send Message (Admin Chat)
// @route   POST /api/admin/chat
const sendMessage = async (req, res) => {
    try {
        const { message, tenant_id } = req.body;
        
        if (!message || !tenant_id) {
            return res.status(400).json({ message: 'Message and Tenant ID are required' });
        }

        // Assuming admin user ID is 1 (based on your frontend logic)
        const adminId = 1;

        const query = `
            INSERT INTO messages (sender_id, receiver_id, message, sender_type, status) 
            VALUES ($1, $2, $3, 'admin', 'sent') 
            RETURNING *;
        `;
        const result = await db.query(query, [adminId, tenant_id, message]);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ message: 'Server error sending message' });
    }
};

module.exports = { 
    getDashboardStats, 
    getAllRooms, 
    createRoom, 
    updateRoom, 
    deleteRoom,
    getAllTenants, 
    getAllPayments, 
    getAllRequests, 
    updateTenant, 
    deleteTenant,
    createTenant,
    getMessages,  
    sendMessage    
};