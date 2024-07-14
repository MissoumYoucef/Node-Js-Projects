const Order = require('../models/Order');
const Product = require('../models/Product'); // You'll need the Product model for updating stock

// Controller functions:

// 1. Create a new order
exports.createOrder = async (req, res) => {
  try {
    // 1. Get order details from request body
    const { items, shippingAddress } = req.body;

    // 2. Calculate totalAmount (you might need to fetch product prices here if not provided in the request)
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      item.priceAtPurchase = product.price; // Assuming you have a price field in your product schema
      totalAmount += item.quantity * item.priceAtPurchase;
    }

    // 3. Create a new order object
    const newOrder = new Order({
      user: req.user._id, // Assuming you are storing user ID in the request object after authentication
      items,
      totalAmount,
      shippingAddress,
    });

    // 4. Save the order to the database
    const savedOrder = await newOrder.save();

    // 5. Return the saved order
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email'); // Populate user details
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get a specific order by ID (user can only access their own orders)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Check if the user owns the order (assuming req.user is available after authentication)
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to view this order' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update an order (admin only)
exports.updateOrder = async (req, res) => {
  try {
    // Implement logic to update order details (e.g., status, shipping information)
    // ...
    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Delete an order (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    // Implement logic to delete an order by ID
    // ...
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Get current user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const myOrders = await Order.find({ user: req.user._id }).populate('user', 'name email');
    res.json(myOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};