const Category = require('../models/Category'); 

// Get all products
exports.getAllCategories = async (req, res) => {
  try {
    // const products = await Product.find().populate('category', 'name'); // Populate category name
    const categories = await Category.find(); // Populate category name
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getCategoryById = async (req, res) => {
  try {
    // const product = await Product.findById(req.params.id).populate('category', 'name');
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product (admin only) 
// ... (Implementation for adding a new product)

// Update a product (admin only)
// ... (Implementation for updating an existing product)

// Delete a product (admin only)
// ... (Implementation for deleting a product)