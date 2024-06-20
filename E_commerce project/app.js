const express = require('express');
const bodyParser = require('body-parser');
// const session = require('express-session'); 
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/product_routes.js');
const connectDB = require('./db/db.js'); 
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// Connect to the database before starting the server
const startServer = async () => {
    try {
        await connectDB(); 
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Could not connect to the database:', err);
        process.exit(1); 
    }
}

startServer(); 

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors()); // Enable CORS 
// app.use(session({
//     secret: process.env.SESSION_SECRET, 
//     resave: false,
//     saveUninitialized: true 
// })); 

app.use('/api/products', productRoutes);

// Serve static files from the 'public' directory
app.use(express.static('public'));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

