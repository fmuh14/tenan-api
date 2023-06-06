/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  getAllTourisms,
  getTourismsbyCity,
  getTourismsDetail} = require('../controllers/tourismsController');

router.get('/tourisms', getAllTourisms);
router.get('/tourisms/{city}', getTourismsbyCity);
router.get('/tourisms/{tourismsId}', getTourismsDetail);

module.exports = router;
