const jwt = require('jsonwebtoken');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const {knex} = require('../configs/data-source.js');
const {
  validateEmail,
  validatePassword,
} = require('../utils/validation.js');

const register = async (req, res) => {
  const {userId, name, email, password} = req.body;
  if (!userId || !name || !email || !password) {
    return res.status(400).send({
      code: '400',
      status: 'Bad Request',
      errors: {
        message: 'Missing attribute',
      },
    });
  }

  if (validateEmail(email)) {
    return res.status(400).send({
      code: '400',
      status: 'Bad Request',
      errors: {
        message: 'Invalid Email',
      },
    });
  }

  if (validatePassword(password)) {
    return res.status(400).send({
      code: '400',
      status: 'Bad Request',
      errors: {
        message:
        'The password must be between 8-16 characters and contain numbers',
      },
    });
  }

  // Validate Email
  const verifEmail = await knex('users').where('email', email);
  console.log(verifEmail);
  if (verifEmail.length !== 0) {
    return res.status(409).send({
      code: '409',
      status: 'Conflict',
      errors: {
        message: 'Email already exists',
      },
    });
  }

  // Validate Username
  const verifUserId = await knex('users').where('user_id', userId);
  if (verifUserId.length !== 0) {
    return res.status(409).send({
      code: '409',
      status: 'Conflict',
      errors: {
        message: 'Username already exists',
      },
    });
  }

  const user = {
    user_id: userId,
    name,
    email,
    password,
  };

  // Password hashing
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) throw err;
      user.password = hash;
      // Store user to DB
      knex('users').insert(user).then(res.status(200).send({
        message: 'Register successfully.',
      }));
    });
  });
};

const login = async (req, res) => {
  const userId = req.body.userId;
  const password = req.body.password;

  // Validate Username
  const validUser = await knex('users').where('user_id', userId);
  if (validUser.length === 0) {
    return res.status(401).send({
      message: 'Incorrect username or password.',
    });
  }

  // Check Password
  bcrypt.compare(password, validUser[0].password, function(err, result) {
    if (result) {
      const user = {
        userId: validUser[0].user_id,
        name: validUser[0].name,
      };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: '1hr'});
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      res.json({accessToken, refreshToken});
    } else {
      return res.status(401).send({
        message: 'Incorrect username or password.',
      });
    }
  });
};

const dashboard = async (req, res) => {
  res.send({
    message: 'OK',
  });
};

module.exports = {
  login,
  register,
  dashboard,
};

