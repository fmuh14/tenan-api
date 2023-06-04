/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');
const {
  login,
  register,
  dashboard,
  token,
  logout} = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register);
router.post('/token', token);
router.post('/dashboard', authenticateToken, dashboard);
router.post('/logout', logout);

module.exports = router;
