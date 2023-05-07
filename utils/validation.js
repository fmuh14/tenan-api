const User = require('../entities/User');

const validateEmail = (email) => {
  return !email.match(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  );
};

const validatePassword = (password) => {
  return !password.match(
      /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
  );
};

const validatePasswordLength = (password) => {
  const minPasswordofChars = 8;
  const maxPasswordofChars = 16;
  if (password.length < minPasswordofChars ||
    password.length > maxPasswordofChars) {
    return true;
  }
};

const verifEmail = async (email) => {
  const user = await User.findOne({email});
  if (user) {
    return true;
  }
  return false;
};

const verifUsername = async (username) => {
  const user = await User.findOne({username});
  if (user) {
    return true;
  }
  return false;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePasswordLength,
};
