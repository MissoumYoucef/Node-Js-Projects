const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};
connectDB(); 

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 6000; 

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Routes
const taskRoutes = require('./routes/tasks'); 
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.render('index'); // Assuming you'll create an 'index.ejs' view
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));