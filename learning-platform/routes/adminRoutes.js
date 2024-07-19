const express = require('express');
const { addSubAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add-sub-admin', protect, admin, addSubAdmin);

module.exports = router;
