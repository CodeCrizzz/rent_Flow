const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createRequest, 
    getMyRequests, 
    getAllRequests, 
    updateRequest,
    cancelRequest
} = require('../controllers/requestController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// All request routes require authentication
router.use(protect);

// Tenant Routes
router.post('/', upload.single('attachment'), createRequest);
router.get('/my-requests', getMyRequests);
router.put('/:id/cancel', cancelRequest);

// Admin Routes
router.get('/', getAllRequests);
router.put('/:id', updateRequest);

module.exports = router;
