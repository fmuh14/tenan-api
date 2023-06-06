/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {authenticateRefreshToken,
  authenticateAccessToken} = require('../middleware/authenticate');
const {
  login,
  register,
  dashboard,
  token,
  logout,
  profile,
  addFavoriteTourism,
  deleteFavoriteTourism} = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register);
router.post('/token', authenticateRefreshToken, token);
router.post('/dashboard', authenticateAccessToken, dashboard);
router.post('/logout', authenticateRefreshToken, logout);
router.get('/my-profile', authenticateAccessToken, profile);
router.post('/my-favorites', authenticateAccessToken, addFavoriteTourism);
router.delete('/my-favorites/:tourism_id', authenticateAccessToken,
    deleteFavoriteTourism);

module.exports = router;
