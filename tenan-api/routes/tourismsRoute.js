/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  getAllTourisms,
  getTourismsDetail,
  getCity,
  getRecommendedHotels,
  getRecommendedTourisms} = require('../controllers/tourismsController');
const {optionalAuthenticateAccessToken} = require('../middleware/authenticate');

router.get('/', getAllTourisms);
router.get('/city', getCity);
router.get('/:tourismsId', optionalAuthenticateAccessToken, getTourismsDetail);
router.post('/recommendedHotels', getRecommendedHotels);
router.post('/recommendedTourisms', getRecommendedTourisms);

module.exports = router;
