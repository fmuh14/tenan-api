/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  getAllTourisms,
  getTourismsDetail,
  getCity,
  getRecommendedHotels} = require('../controllers/tourismsController');

router.get('/', getAllTourisms);
router.get('/city', getCity);
router.get('/:tourismsId', getTourismsDetail);
router.post('/recommendedHotels', getRecommendedHotels);

module.exports = router;
