const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getTenantDashboard, getTenantProfile, updateTenantProfile, updateTenantPassword,
    getTenantPayments, getCurrentBill, submitTenantPayment,
    getMyRequests, submitRequest, getTenantMessages, sendTenantMessage, getUnreadCount 
} = require('../controllers/tenantController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(protect);

router.get('/dashboard', getTenantDashboard);
router.get('/payments', getTenantPayments);
router.post('/payments', upload.single('proofOfPayment'), submitTenantPayment);
router.get('/bill/current', getCurrentBill);

router.get('/profile', getTenantProfile);
router.put('/profile', updateTenantProfile);
router.put('/profile/password', updateTenantPassword);

router.get('/requests', getMyRequests);
router.post('/requests', submitRequest);

router.get('/chat/unread', getUnreadCount);
router.get('/chat', getTenantMessages);
router.post('/chat', sendTenantMessage);

module.exports = router;