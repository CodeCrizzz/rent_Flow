const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getTenantDashboard, getTenantProfile, getTenantPayments, 
    getMyRequests, submitRequest, getTenantMessages, sendTenantMessage 
} = require('../controllers/tenantController');

router.use(protect);

router.get('/dashboard', getTenantDashboard);
router.get('/payments', getTenantPayments);
router.get('/requests', getMyRequests);
router.post('/requests', submitRequest);
router.get('/profile', getTenantProfile);

router.get('/chat', getTenantMessages);
router.post('/chat', sendTenantMessage);

module.exports = router;