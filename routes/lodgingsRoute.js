/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  getAllLodgings,
  getLodgingsbyCity,
  getLodgingsDetail} = require('../controllers/lodgingsController');

router.get('/lodgings', getAllLodgings);
router.get('/lodgings/{city}', getLodgingsbyCity);
router.get('/lodgings/:lodgingsId', getLodgingsDetail);

module.exports = router;
