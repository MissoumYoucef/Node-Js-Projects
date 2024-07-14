const express = require('express');
const candidateController = require('../controllers/candidateController');
const authenticateJWT = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorize');

const router = express.Router();

router.post('/', authenticateJWT, authorizeRole('admin'), candidateController.addCandidate);

module.exports = router;
