const Product = require('../models/Product'); 

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    // const products = await Product.find().populate('category', 'name'); // Populate category name
    const products = await Product.find(); // Populate category name
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    // const product = await Product.findById(req.params.id).populate('category', 'name');
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
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