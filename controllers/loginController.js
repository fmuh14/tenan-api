const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../entities/User');
const {validateEmail,
  validatePassword,
  validatePasswordLength} = require('../utils/validation');

const register = async (req, res) => {
  const {username, email, password} = req.body;

  if (validateEmail(email)) {
    return res.status(401).send({
      message: 'Invalid email.',
    });
  }

  if (validatePasswordLength(password) || validatePassword(password)) {
    return res.status(401).send({
      message:
      'The password must be between 8-16 characters and contain numbers.',
    });
  }

  // Validate Email
  const verifEmail = await User.findOne({email: email});
  if (verifEmail) {
    return res.status(401).send({
      message: 'Email already exists.',
    });
  }

  // Validate Username
  const verifUsername = await User.findOne({username: username});
  if (verifUsername) {
    return res.status(401).send({
      message: 'Username already exists.',
    });
  }

  const user = new User({
    username,
    email,
    password,
  });

  // Password hashing
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) throw err;
      user.password = hash;
      // Store user to db
      user.save().then(res.status(200).send({
        message: 'Register successfully.',
      }));
    });
  });
};

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validate Username
  const validUser = await User.findOne({username: username});
  if (!validUser) {
    return res.status(401).send({
      message: 'Incorrect username or password.',
    });
  }

  bcrypt.compare(password, validUser.password, function(err, result) {
    if (result) {
      const user = {name: username};
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({accessToken});
    } else {
      return res.status(401).send({
        message: 'Incorrect username or password.',
      });
    }
  });
};

module.exports = {
  login,
  register,
};

