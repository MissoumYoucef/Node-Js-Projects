const mongoose = require('mongoose');
require('dotenv').config(); 
const db = process.env.MONGO_URI;

const connectDB = async () => {
    try {
      await mongoose.connect(db);
      console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};
module.exports = connectDB; 