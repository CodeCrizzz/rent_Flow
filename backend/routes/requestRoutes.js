const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createRequest, 
    getMyRequests, 
    getAllRequests, 
    updateRequest 
} = require('../controllers/requestController');

// All request routes require authentication
router.use(protect);

// Tenant Routes
router.post('/', createRequest);
router.get('/my-requests', getMyRequests);

// Admin Routes
router.get('/', getAllRequests);
router.put('/:id', updateRequest);

module.exports = router;
