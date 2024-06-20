const express = require('express');
const mongoose = require('mongoose'); 
const productRoutes = require('./routes/productRoutes'); // Assuming your routes are here
require('dotenv').config();
// ... other imports

const app = express();
const port = process.env.PORT; // Use environment port or 5000 as default

// ... your middleware, database connection (from previous examples)
// MongoDB Connection
const dbURI = process.env.MONGODB_URI; 

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};
connectDB(); 
// Routes
app.use('/api/products', productRoutes);

// Start the server 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 