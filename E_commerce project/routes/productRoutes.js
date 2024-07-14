const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer  = require('multer');
const path = require('path'); 

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/'); // Make sure the directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Public Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById); 

// Post route for adding a new product
router.post('/add-product', upload.single('image'),productController.createProduct);

// Update Product 
router.put('/update-product/:id', upload.single('image'), productController.updateProduct); 

// Delete Product
router.delete('/delete-product/:id', productController.deleteProduct);
module.exports = router;

