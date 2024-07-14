const express = require('express');
const voteController = require('../controllers/voteController');
const authenticateJWT = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticateJWT, voteController.vote);

module.exports = router;
