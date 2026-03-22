const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats, getAllTenants } = require('../controllers/adminController');

// Extra security: Only allow Admins
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// Apply protect AND adminOnly to ALL routes in this file
router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/tenants', getAllTenants);

module.exports = router;