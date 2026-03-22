const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats, getAllTenants, getAllRooms } = require('../controllers/adminController');

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/tenants', getAllTenants);
router.get('/rooms', getAllRooms); // NEW: Route for Rooms!
router.get('/payments', getAllPayments);
router.get('/requests', getAllRequests);

module.exports = router;