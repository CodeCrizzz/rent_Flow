const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTenantDashboard } = require('../controllers/tenantController');

// Apply protect to all routes (Must be logged in)
router.use(protect);

router.get('/dashboard', getTenantDashboard);
router.get('/payments', getTenantPayments);
router.get('/requests', getTenantRequests);
router.get('/profile', getTenantProfile);

module.exports = router;