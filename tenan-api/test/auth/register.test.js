const request = require('supertest');
const app = require('../../index');
const {knex} = require('../../configs/data-source.js');

const validUserRegister = {
  email: 'test@example.com',
  name: 'John Doe',
  password: 'testuser1234',
};

describe('user registration', () => {
  describe('given the email, name and password are valid', () => {
    it('should return register success', async () => {
      const response = await request(app).post('/v1/user/signup')
          .send(validUserRegister);

      expect(response.statusCode).toEqual(200);

      // Asserting specific fields
      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data.message)
          .toBe('Register Success. Please Log in');

      // expect(response.body).toMatchObject({
      //   code: '200',
      //   status: 'OK',
      //   data: {
      //     message: 'Register Success. Please Log in',
      //   },
      // });
    });
  });

  describe('given the email already registered', () => {
    it('should return error 409', async () => {
      const response = await request(app).post('/v1/user/signup')
          .send({
            email: 'test1234@gmail.com',
            name: 'John Doe',
            password: 'testuser1234',
          });

      expect(response.statusCode).toEqual(409);

      expect(response.body.code).toBe('409');
      expect(response.body.status).toBe('Conflict');
      expect(response.body.errors.message).toBe('Email already exists');

      // expect(response.body).toMatchObject({
      //   code: '409',
      //   status: 'Conflict',
      //   errors: {
      //     message: 'Email already exists',
      //   },
      // });
    });
  });

  describe('given the email not valid', () => {
    it('should return error 400', async () => {
      const response = await request(app).post('/v1/user/signup')
          .send({
            email: 'testemail@',
            name: 'John Doe',
            password: 'testuser1234',
          });

      expect(response.statusCode).toEqual(400);

      expect(response.body.code).toBe('400');
      expect(response.body.status).toBe('Bad Request');
      expect(response.body.errors.message).toBe('Invalid Email');

      // expect(response.body).toMatchObject({
      //   code: '400',
      //   status: 'Bad Request',
      //   errors: {
      //     message: 'Invalid Email',
      //   },
      // });
    });
  });

  describe('given the password not valid', () => {
    it('should return error 400', async () => {
      const response = await request(app).post('/v1/user/signup')
          .send({
            email: 'test@example.com',
            name: 'John Doe',
            password: 'test',
          });

      expect(response.statusCode).toEqual(400);

      expect(response.body.code).toBe('400');
      expect(response.body.status).toBe('Bad Request');
      expect(response.body.errors.message).toBe(
          'The password must be between 8-16 characters and contain numbers');

      // expect(response.body).toMatchObject({
      //   code: '400',
      //   status: 'Bad Request',
      //   errors: {
      //     message:
      //     'The password must be between 8-16 characters and contain numbers',
      //   },
      // });
    });
  });

  describe('given no attribute send', () => {
    it('should return error 400', async () => {
      const response = await request(app).post('/v1/user/signup')
          .send();

      expect(response.statusCode).toEqual(400);

      expect(response.body.code).toBe('400');
      expect(response.body.status).toBe('Bad Request');
      expect(response.body.errors.message).toBe(
          'Missing attribute');

      // expect(response.body).toMatchObject({
      //   code: '400',
      //   status: 'Bad Request',
      //   errors: {
      //     message:
      //     'Missing attribute',
      //   },
      // });
    });
  });

  afterAll(async () => {
    await knex('users').where('email', validUserRegister.email).del();
  });
});

module.exports = validUserRegister;
