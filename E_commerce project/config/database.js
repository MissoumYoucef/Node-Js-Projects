const mongoose = require('mongoose');

const connectDB = async (dbURI) => {
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};
module.exports = connectDB;