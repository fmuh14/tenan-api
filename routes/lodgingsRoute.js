/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  getAllLodgings,
  getlodgingsDetail} = require('../controllers/lodgingsController');

router.get('/', getAllLodgings);
router.get('/:lodgingsId', getlodgingsDetail);

module.exports = router;
