const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect} = require('../middleware/auth');

// Public Routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById); 

// Admin Routes (Assuming you have authentication middleware)
router.post('/', protect, categoryController.createCategory); // Create a category
router.put('/:id', protect, categoryController.updateCategory); // Update a category
router.delete('/:id', protect, categoryController.deleteCategory); // Delete a category

module.exports = router;

