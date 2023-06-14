/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {authenticateRefreshToken,
  authenticateAccessToken} = require('../middleware/authenticate');
const {
  login,
  register,
  token,
  logout,
  profile,
  addFavoriteTourism,
  deleteFavoriteTourism,
  showFavoriteTourisms,
  addFavoriteLodging,
  deleteFavoriteLodging,
  showFavoriteLodgings} = require('../controllers/userController');

router.post('/signin', login);
router.post('/signup', register);
router.post('/token', authenticateRefreshToken, token);
router.post('/signout', authenticateRefreshToken, logout);
router.get('/my-profile', authenticateAccessToken, profile);
router.get('/my-favorites-tourisms', authenticateAccessToken,
    showFavoriteTourisms);
router.post('/my-favorites-tourisms', authenticateAccessToken,
    addFavoriteTourism);
router.delete('/my-favorites-tourisms/:tourism_id', authenticateAccessToken,
    deleteFavoriteTourism);
router.get('/my-favorites-lodgings', authenticateAccessToken,
    showFavoriteLodgings);
router.post('/my-favorites-lodgings', authenticateAccessToken,
    addFavoriteLodging);
router.delete('/my-favorites-lodgings/:lodging_id', authenticateAccessToken,
    deleteFavoriteLodging);

module.exports = router;
