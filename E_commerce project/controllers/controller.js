const Product = require('../models/product'); // Import your Product model

const productController = {
    // Get all products
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Get a single product by ID
    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (product == null) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Create a new product 
    createProduct: async (req, res) => {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            imageUrl: req.body.imageUrl, 
            // ... other fields
        });

        try {
            const newProduct = await product.save();
            res.status(201).json(newProduct); 
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Update a product
    updateProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (product == null) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Update product fields
            product.name = req.body.name || product.name;
            product.price = req.body.price || product.price;
            // ... update other fields

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Delete a product 
    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (product == null) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ message: 'Product deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = productController;