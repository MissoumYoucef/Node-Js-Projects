const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); 
const User = require('../models/User'); 
const Product = require('../models/Product');
const { protect } = require('../middleware/auth'); // Assuming you have an auth middleware

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private 
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // 1. Validate input 
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Please provide a valid items array' });
    }

    if (!shippingAddress || 
        !shippingAddress.street || 
        !shippingAddress.city || 
        !shippingAddress.zip || 
        !shippingAddress.country) {
      return res.status(400).json({ error: 'Please provide a complete shipping address' });
    }

    // 2. Retrieve product details and check stock
    const products = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product not found with ID: ${item.product}` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product: ${product.name}` });
      }
      return product;
    }));

    // 3. Calculate total order amount
    let totalAmount = 0;
    const orderItems = items.map((item, index) => {
      const product = products[index];
      const priceAtPurchase = product.price;
      const itemTotal = priceAtPurchase * item.quantity;
      totalAmount += itemTotal;

      return {
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: priceAtPurchase,
      };
    });

    // 4. Create the order
    const newOrder = new Order({
      user: req.user._id, // Assuming req.user is populated by the 'protect' middleware
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    // 5. Save the order to the database
    const savedOrder = await newOrder.save();

    // 6. Update product stock quantities (ideally with a transaction)
    await Promise.all(products.map(async (product, index) => {
      product.stockQuantity -= items[index].quantity;
      await product.save();
    }));

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});
// @route   GET /api/orders
// @desc    Get all orders for the logged-in user
// @access  Private 
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get a single order by ID (for the logged-in user)
// @access  Private 
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;