// models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true } // Store the price at the time of purchase
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    // Define fields for address (street, city, zip, etc.)
    type: Object,
    required: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  // Add fields for payment information (if storing), tracking number, etc.
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);