const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTenantDashboard } = require('../controllers/tenantController');

// Apply protect to all routes (Must be logged in)
router.use(protect);

router.get('/dashboard', getTenantDashboard);

module.exports = router;