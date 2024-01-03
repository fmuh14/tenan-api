const generateRandomString = (length) => {
  const characters =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

const createTestUser = () => {
  const randomEmail = `test_${generateRandomString(5)}@example.com`;
  const randomName = `TestUser${generateRandomString(5)}`;
  const password = 'testpassword1234';

  const validUserLogin = {
    email: randomEmail,
    password: password,
  };

  const validUserRegister = {
    email: randomEmail,
    name: randomName,
    password: password,
  };
  return {validUserLogin, validUserRegister};
};

module.exports = {createTestUser};
