const mongoose = require('mongoose');
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/online-forms';

const connectDB = async () => {
    try {
      await mongoose.connect(db);
      console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};
module.exports = connectDB; 