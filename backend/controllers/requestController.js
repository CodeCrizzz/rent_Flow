const db = require('../config/db');

// @desc    Create a new maintenance request
// @route   POST /api/requests
// @access  Tenant
const createRequest = async (req, res) => {
    try {
        const tenant_id = req.user.id;
        const { title, description, category, priority } = req.body;
        const attachment_url = req.file ? `/uploads/${req.file.filename}` : null;

        const newRequest = await db.query(
            `INSERT INTO requests (tenant_id, title, description, category, priority, attachment_url) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [tenant_id, title, description, category || 'Other', priority || 'Normal', attachment_url]
        );

        res.status(201).json({ message: 'Request submitted successfully', request: newRequest.rows[0] });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Server error while creating request' });
    }
};

// @desc    Get all requests for a specific tenant
// @route   GET /api/requests/my-requests
// @access  Tenant
const getMyRequests = async (req, res) => {
    try {
        const tenant_id = req.user.id;
        const requests = await db.query(
            `SELECT * FROM requests WHERE tenant_id = $1 ORDER BY created_at DESC`,
            [tenant_id]
        );
        res.status(200).json(requests.rows);
    } catch (error) {
        console.error('Error fetching tenant requests:', error);
        res.status(500).json({ message: 'Server error while fetching requests' });
    }
};

// @desc    Get all maintenance requests
// @route   GET /api/requests
// @access  Admin
const getAllRequests = async (req, res) => {
    try {
        const requests = await db.query(`
            SELECT 
                r.id, r.title, r.description, r.category, r.priority, r.status, r.created_at, r.assigned_to, r.admin_notes,
                u.name as tenant_name,
                rm.room_number
            FROM requests r
            JOIN users u ON r.tenant_id = u.id
            LEFT JOIN rooms rm ON u.room_id = rm.id
            ORDER BY r.created_at DESC
        `);
        res.status(200).json(requests.rows);
    } catch (error) {
        console.error('Error fetching all requests:', error);
        res.status(500).json({ message: 'Server error while fetching all requests' });
    }
};

// @desc    Update a maintenance request
// @route   PUT /api/requests/:id
// @access  Admin
const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority, assigned_to, admin_notes } = req.body;

        const updatedRequest = await db.query(
            `UPDATE requests 
             SET status = COALESCE($1, status),
                 priority = COALESCE($2, priority),
                 assigned_to = COALESCE($3, assigned_to),
                 admin_notes = COALESCE($4, admin_notes)
             WHERE id = $5 RETURNING *`,
            [status, priority, assigned_to, admin_notes, id]
        );

        if (updatedRequest.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request updated successfully', request: updatedRequest.rows[0] });
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ message: 'Server error while updating request' });
    }
};

// @desc    Cancel a maintenance request
// @route   PUT /api/requests/:id/cancel
// @access  Tenant
const cancelRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const tenant_id = req.user.id;

        // Check if the request exists and belongs to the tenant
        const checkResult = await db.query(
            "SELECT * FROM requests WHERE id = $1 AND tenant_id = $2",
            [id, tenant_id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Request not found or not authorized' });
        }

        const request = checkResult.rows[0];
        if (request.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending requests can be cancelled' });
        }

        const updatedRequest = await db.query(
            "UPDATE requests SET status = 'Cancelled' WHERE id = $1 RETURNING *",
            [id]
        );

        res.status(200).json({ message: 'Request cancelled successfully', request: updatedRequest.rows[0] });
    } catch (error) {
        console.error('Error cancelling request:', error);
        res.status(500).json({ message: 'Server error while cancelling request' });
    }
};

module.exports = {
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequest,
    cancelRequest
};
