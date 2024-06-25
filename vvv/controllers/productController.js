const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name'); // Populate category name
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    // Assuming you are handling image uploads and getting the path in req.file.path
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category, 
      sizes: req.body.sizes,
      colors: req.body.colors,
      stockQuantity: req.body.stockQuantity,
      imagePath: `/images/${req.file.filename}` // Construct the image path
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Update a product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category, 
      sizes: req.body.sizes,
      colors: req.body.colors,
      stockQuantity: req.body.stockQuantity,
      // Handle image update if needed:
      // imagePath: newImagePath // Set a new imagePath if an image was uploaded
    }, { new: true }); // Return the updated product

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // You might want to delete the associated image from your 'uploads' folder here
    // ...

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};