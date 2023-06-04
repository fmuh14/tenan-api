/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
// const authenticateToken = require('../middleware/authenticate');
const {
  attractions} = require('../controllers/attractionsController');

router.get('/attractions', attractions);
