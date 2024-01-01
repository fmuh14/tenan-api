const {knex} = require('../configs/data-source.js');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (user) => {
  const hash = bcrypt.hashSync(user.password, saltRounds);

  user.password = hash;

  const response = await knex('users').insert(user).catch((err) => {
    return 0;
  });

  return response;
};

const createAccessToken = (user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: '1hr'});

  return accessToken;
};

const createRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: '365d'});

  return refreshToken;
};

module.exports = {createUser, createAccessToken, createRefreshToken};
