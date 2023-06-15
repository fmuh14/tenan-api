/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  getAllLodgings,
  getlodgingsDetail} = require('../controllers/lodgingsController');
const {optionalAuthenticateAccessToken} = require('../middleware/authenticate');

router.get('/', getAllLodgings);
router.get('/:lodgingsId', optionalAuthenticateAccessToken, getlodgingsDetail);

module.exports = router;
