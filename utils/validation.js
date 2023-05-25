const validateEmail = (email) => {
  return !email.match(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  );
};

const validatePassword = (password) => {
  return !password.match(
      // The password must be between 8-16 characters and contain numbers
      /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
  );
};

module.exports = {
  validateEmail,
  validatePassword,
};

