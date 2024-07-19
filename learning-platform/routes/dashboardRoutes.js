const express = require('express');
const { adminDashboard } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, admin, adminDashboard);

module.exports = router;
