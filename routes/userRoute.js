/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {login, register, dashboard} = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticate');

router.post('/login', login);
router.post('/register', register);
router.post('/dashboard', authenticateToken, dashboard);

module.exports = router;
