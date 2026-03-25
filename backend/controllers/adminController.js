const db = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get Admin Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        // Run all queries concurrently for performance
        const [
            roomsResult, roomStatusResult, 
            tenantsResult, tenantStatusResult, recentTenantsResult,
            incomeResult, duesResult,
            requestsResult, recentPaymentsResult, recentRequestsResult
        ] = await Promise.all([
            // 1. Rooms Overview
            db.query('SELECT COUNT(*) FROM rooms'),
            db.query('SELECT status, COUNT(*) FROM rooms GROUP BY status'),
            
            // 2. Tenants Overview (Total & Status)
            db.query("SELECT COUNT(*) FROM users WHERE role = 'tenant'"),
            db.query("SELECT status, COUNT(*) FROM users WHERE role = 'tenant' GROUP BY status"),
            db.query("SELECT id, name, created_at FROM users WHERE role = 'tenant' ORDER BY created_at DESC LIMIT 5"),
            
            // 3. Billing Overview
            db.query("SELECT SUM(amount_paid) FROM payments WHERE EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE)"),
            db.query("SELECT status, SUM(balance) FROM bills WHERE status IN ('Unpaid', 'Partial', 'Overdue') GROUP BY status"),
            
            // 4. Maintenance Summary
            db.query("SELECT status, COUNT(*) FROM requests GROUP BY status"),
            
            // 5. Recent Payments & Requests for Activity Feed
            db.query(`
                SELECT p.id, u.name as tenant_name, p.amount_paid, p.payment_date 
                FROM payments p 
                JOIN bills b ON p.bill_id = b.id 
                JOIN users u ON b.tenant_id = u.id 
                ORDER BY p.payment_date DESC LIMIT 5
            `),
            db.query(`
                SELECT r.id, u.name as tenant_name, r.title, r.created_at 
                FROM requests r 
                JOIN users u ON r.tenant_id = u.id 
                ORDER BY r.created_at DESC LIMIT 5
            `),
        ]);

        // --- Process Room Stats ---
        const totalRooms = parseInt(roomsResult.rows[0].count);
        let occupiedRooms = 0, availableRooms = 0, maintenanceRooms = 0;
        roomStatusResult.rows.forEach(r => {
            if (r.status.toLowerCase() === 'occupied' || r.status.toLowerCase() === 'partial') occupiedRooms += parseInt(r.count);
            else if (r.status.toLowerCase() === 'available') availableRooms += parseInt(r.count);
            else if (r.status.toLowerCase() === 'maintenance') maintenanceRooms += parseInt(r.count);
        });

        // --- Process Tenant Stats ---
        const totalTenants = parseInt(tenantsResult.rows[0].count);
        let activeTenants = 0, pendingTenants = 0;
        tenantStatusResult.rows.forEach(r => {
            if (r.status.toLowerCase() === 'active') activeTenants += parseInt(r.count);
            else if (r.status.toLowerCase() === 'pending') pendingTenants += parseInt(r.count);
        });

        // --- Process Billing Stats ---
        const monthlyIncome = incomeResult.rows[0].sum || 0;
        let pendingDues = 0, overduePayments = 0;
        duesResult.rows.forEach(r => {
            if (r.status.toLowerCase() === 'overdue') overduePayments += parseFloat(r.sum);
            pendingDues += parseFloat(r.sum); // Pending is the sum of Unpaid, Partial, Overdue
        });

        // --- Process Maintenance Stats ---
        let totalRequests = 0, pendingRequests = 0, inProgressRequests = 0, resolvedRequests = 0;
        requestsResult.rows.forEach(r => {
            const count = parseInt(r.count);
            totalRequests += count;
            if (r.status.toLowerCase() === 'pending') pendingRequests += count;
            else if (r.status.toLowerCase() === 'in progress') inProgressRequests += count;
            else if (r.status.toLowerCase() === 'resolved') resolvedRequests += count;
        });

        // --- Synthesize Recent Activities ---
        let activities = [];
        
        // Add recent tenants
        recentTenantsResult.rows.forEach(t => {
            activities.push({
                id: `t_${t.id}`,
                type: 'tenant',
                title: 'New tenant registered',
                description: `${t.name} joined the system`,
                date: t.created_at
            });
        });

        // Add recent payments
        recentPaymentsResult.rows.forEach(p => {
            activities.push({
                id: `p_${p.id}`,
                type: 'payment',
                title: 'Payment received',
                description: `₱${parseFloat(p.amount_paid).toLocaleString()} from ${p.tenant_name}`,
                date: p.payment_date
            });
        });

        // Add recent requests
        recentRequestsResult.rows.forEach(req => {
            activities.push({
                id: `r_${req.id}`,
                type: 'maintenance',
                title: 'Maintenance request',
                description: `"${req.title}" by ${req.tenant_name}`,
                date: req.created_at
            });
        });

        // Sort activities by date DESC and keep top 10
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        activities = activities.slice(0, 10);

        // --- Final Response Object ---
        res.status(200).json({
            rooms: { totalRooms, occupiedRooms, availableRooms, maintenanceRooms },
            tenants: { totalTenants, activeTenants, pendingTenants },
            billing: { monthlyIncome, pendingDues, overduePayments },
            maintenance: { totalRequests, pendingRequests, inProgressRequests, resolvedRequests },
            recentActivities: activities
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

// @desc    Get all Conversations (Chat List for Admin)
// @route   GET /api/admin/chat/conversations
const getConversations = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, u.name, r.room_number,
                (
                    SELECT message FROM messages 
                    WHERE (sender_id = u.id AND receiver_id = 1) OR (sender_id = 1 AND receiver_id = u.id)
                    ORDER BY created_at DESC LIMIT 1
                ) as last_message,
                (
                    SELECT created_at FROM messages 
                    WHERE (sender_id = u.id AND receiver_id = 1) OR (sender_id = 1 AND receiver_id = u.id)
                    ORDER BY created_at DESC LIMIT 1
                ) as last_message_time,
                (
                    SELECT COUNT(*) FROM messages 
                    WHERE sender_id = u.id AND receiver_id = 1 AND status != 'read'
                ) as unread_count
            FROM users u
            LEFT JOIN rooms r ON u.room_id = r.id
            WHERE u.role = 'tenant'
            ORDER BY last_message_time DESC NULLS LAST
        `;
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Get Conversations Error:', error);
        res.status(500).json({ message: 'Server error fetching conversations' });
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
        
        // Mark unread messages from this tenant as read
        await db.query(`
            UPDATE messages 
            SET status = 'read' 
            WHERE sender_id = $1 AND receiver_id = 1 AND status != 'read'
        `, [tenant_id]);
        
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
    getConversations,
    getMessages,  
    sendMessage    
};