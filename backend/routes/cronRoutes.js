const express = require('express');
const router = express.Router();
const { runBillingCron } = require('../controllers/cronController');

router.post('/billing', runBillingCron);

module.exports = router;
