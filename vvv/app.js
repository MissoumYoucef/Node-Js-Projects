const express = require('express');
const connectDB = require('./config/database'); 
const passport = require('./config/passport');
const productRoutes = require('./routes/productRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/authRoutes');
const ordeRoutes = require('./routes/orderRoutes');
require('dotenv').config();
// ... other imports

const app = express();

// Middleware
// MongoDB Connection
const dbURI = process.env.MONGODB_URI; 
connectDB(dbURI); 

// JWT
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(passport.initialize());


// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/user',userRoutes); 
app.use('/api/orders', require('./middleware/auth').protect, ordeRoutes); 


// Start the server 
const port = process.env.PORT; // Use environment port or 5000 as default
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 