const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

// JWT Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; 

        const user = await User.findOne({ email }); 
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' }); 
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 

        // Successful login, send back the token 
        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}); 

// Register Route
router.post('/register', async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    await newUser.save();

    // After successful registration, automatically log the user in 
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token }); // Send the token on successful registration

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Registration failed.'); 
  }
});

// Logout Route (JWT doesn't require a server-side logout)
router.get('/logout', (req, res) => { 
  // For JWT, client-side handling is usually enough.
  // You can clear the token from local storage, cookies, etc., on the frontend. 
  res.json({ message: 'Logged out successfully' }); // Or a similar success response
});


module.exports = router; 