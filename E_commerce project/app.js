const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./db'); 
require('dotenv').config(); 


// Connect to the database before starting the server
const startServer = async () => {
    try {
        await connectDB(); // Call the function to connect

        // Start the server only after successful database connection
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Could not connect to the database:', err);
        process.exit(1); // Exit the process if database connection fails
    }
}

startServer();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use('/api/products', productRoutes);