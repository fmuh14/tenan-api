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

module.exports = {
  validateEmail,
  validatePassword,
  validatePasswordLength,
};

