/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  getAllAttractions,
  getAttractionsbyCity,
  getAttractionsDetail} = require('../controllers/attractionsController');

router.get('/attractions', getAllAttractions);
router.get('/attractions/{city}', getAttractionsbyCity);
router.get('/attractions/{attractionsId}', getAttractionsDetail);
