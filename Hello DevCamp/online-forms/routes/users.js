const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const secret = process.env.JWT_SECRET;

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register
// Register Route 1
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    console.log(name, email, password, password2);
    let errors = [];

    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 4) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
      // Send validation errors to the frontend
      res.status(400).json({ errors });
      return;
    }    

    const newUser = new User({
      name: name,
      email: email,
      password: password,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Registration failed.'); 
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({ msg: 'That email is not registered' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const payload = { id: user.id, name: user.name };
        jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ success: true, token: 'Bearer ' + token, redirectUrl: '/dashboard' });
        });
      } else {
        return res.status(400).json({ msg: 'Password incorrect' });
      }
    });
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
