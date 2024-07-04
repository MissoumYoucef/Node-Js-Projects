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

// Create a new category (admin only)
exports.createCategory = async (req, res) => {
  const category = new Category(req.body); 
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory); 
  } catch (error) {
    res.status(400).json({ message: error.message }); 
  }
};

// Update a category (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update the category properties with data from the request body
    Object.assign(category, req.body); 

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message }); 
  }
};

// Delete a category (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};