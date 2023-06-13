/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  getAllTourisms,
  getTourismsDetail,
  getCity} = require('../controllers/tourismsController');

router.get('/', getAllTourisms);
router.get('/city', getCity);
router.get('/:tourismsId', getTourismsDetail);

module.exports = router;
