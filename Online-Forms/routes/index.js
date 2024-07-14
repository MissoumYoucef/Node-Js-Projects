const express = require('express');
const router = express.Router();
const authenticateToken = require('../config/verifyJwt');

router.get('/', (req, res) => res.render('index'));

router.get('/dashboard', authenticateToken, (req, res) => {
  res.render('dashboard', {
    user: req.user
  });
});

module.exports = router;