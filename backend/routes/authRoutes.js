const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route for User Registration (POST /api/auth/register)
router.post('/register', registerUser);

// Route for User Login (POST /api/auth/login)
router.post('/login', loginUser);

module.exports = router;