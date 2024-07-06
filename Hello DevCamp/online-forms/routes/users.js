const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        newUser.save()
          .then(user => {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
          })
          .catch(err => console.log(err));
      }
    });
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
          res.json({ success: true, token: 'Bearer ' + token });
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
