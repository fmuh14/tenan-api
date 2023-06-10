/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  getAllLodgings,
  getLodgingsbyCity,
  getLodgingsDetail} = require('../controllers/lodgingsController');

router.get('/', getAllLodgings);
router.get('/:city', getLodgingsbyCity);
router.get('/:lodgingsId', getLodgingsDetail);

module.exports = router;
