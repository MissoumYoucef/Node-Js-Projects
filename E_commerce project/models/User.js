// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 


const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { type: String, required: true }, 
  // You'll likely want to hash passwords in a real app.
  firstName: { type: String },
  lastName: { type: String },
  // Add fields for address, phone number, etc. as needed
}, { timestamps: true });

// Method to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      return next();
  }
  try {
      const salt = await bcrypt.genSalt(10); 
      this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (error) {
      return next(error); 
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
      return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
      throw error; // Or handle the error appropriately 
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;