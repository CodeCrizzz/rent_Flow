const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTenantDashboard, getTenantProfile, getTenantPayments, getMyRequests, submitRequest } = require('../controllers/tenantController');

// Apply protect to all routes (Must be logged in)
router.use(protect);

router.get('/dashboard', getTenantDashboard);
router.get('/payments', getTenantPayments);
router.get('/requests', getMyRequests);
router.post('/requests', submitRequest);
router.get('/profile', getTenantProfile);

module.exports = router;