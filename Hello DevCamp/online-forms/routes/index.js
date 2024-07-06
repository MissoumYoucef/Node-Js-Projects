const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => res.render('index'));

router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('dashboard', {
    user: req.user
  });
});

module.exports = router;
