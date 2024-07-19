const express = require('express');
const { addCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, adminOrSubAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, adminOrSubAdmin, addCourse);
router.put('/:id', protect, adminOrSubAdmin, updateCourse);
router.delete('/:id', protect, adminOrSubAdmin, deleteCourse);

module.exports = router;
