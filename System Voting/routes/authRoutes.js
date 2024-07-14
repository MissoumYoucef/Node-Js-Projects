const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  check('username').isString(),
  check('password').isString(),
], authController.register);

router.post('/login', [
  check('username').isString(),
  check('password').isString(),
], authController.login);

module.exports = router;
