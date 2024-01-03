const request = require('supertest');
const app = require('../../index');
const {knex} = require('../../configs/data-source.js');
const {createTestUser} = require('../dataTest.js');

const {validUserLogin, validUserRegister} = createTestUser();

describe('authentication', () => {
  let refreshToken;

  beforeAll(async () => {
    console.log('creating user data in beforeAll hook...');
    await request(app).post('/v1/user/signup').send(validUserRegister);
  });

  describe('given the email and password are valid', () => {
    it('should return login success', async () => {
      const responseLogin = await request(app).post('/v1/user/signin')
          .send(validUserLogin);

      expect(responseLogin.statusCode).toBe(200);

      expect(responseLogin.body.code).toBe('200');
      expect(responseLogin.body.status).toBe('OK');
      expect(responseLogin.body.data.accessToken).toEqual(expect.any(String));
      expect(responseLogin.body.data.refreshToken)
          .toEqual(expect.any(String));

      refreshToken = responseLogin.body.data.refreshToken;

      // expect(response.body).toMatchObject({
      //   code: '200',
      //   status: 'OK',
      //   data: {
      //     accessToken: expect.any(String),
      //     refreshToken: expect.any(String),
      //   },
      // });
    });
  });

  describe('given the email are not registered', () => {
    it('should return login error', async () => {
      const response = await request(app).post('/v1/user/signin')
          .send({
            email: 'test@examp.com',
            password: 'testuser1234',
          });

      expect(response.statusCode).toBe(401);

      expect(response.body.code).toBe('401');
      expect(response.body.status).toBe('Unauthorized');
      expect(response.body.errors.message)
          .toBe('Incorrect email or password');

      // expect(response.body).toMatchObject({
      //   code: '401',
      //   status: 'Unauthorized',
      //   errors: {
      //     message: 'Incorrect email or password',
      //   },
      // });
    });
  });

  describe('given the password is wrong', () => {
    it('should return login error', async () => {
      const response = await request(app).post('/v1/user/signin')
          .send({
            email: 'test@example.com',
            password: 'testuser',
          });

      expect(response.statusCode).toBe(401);

      expect(response.body.code).toBe('401');
      expect(response.body.status).toBe('Unauthorized');
      expect(response.body.errors.message)
          .toBe('Incorrect email or password');

      // expect(response.body).toMatchObject({
      //   code: '401',
      //   status: 'Unauthorized',
      //   errors: {
      //     message: 'Incorrect email or password',
      //   },
      // });
    });
  });

  describe('given the wrong token when logout', () => {
    it('should return token invalid', async () => {
      const response = await request(app).post('/v1/user/signout')
          .set('authorization', `Bearer HAHAHAHA`)
          .send();

      expect(response.statusCode).toBe(401);

      expect(response.body.code).toBe('401');
      expect(response.body.status).toBe('Unauthorized');
      expect(response.body.errors.message)
          .toBe('Token invalid. Please sign in again');

      // expect(response.body).toMatchObject({
      //   code: '401',
      //   status: 'Unauthorized',
      //   errors: {
      //     message: 'Token invalid. Please sign in again',
      //   },
      // });
    });

    it('should return no token provided', async () => {
      const response = await request(app).post('/v1/user/signout')
          .send();

      expect(response.statusCode).toBe(401);

      expect(response.body.code).toBe('401');
      expect(response.body.status).toBe('Unauthorized');
      expect(response.body.errors.message).toBe('No token provided');

      // expect(response.body).toMatchObject({
      //   code: '401',
      //   status: 'Unauthorized',
      //   errors: {
      //     message: 'No token provided',
      //   },
      // });
    });
  });

  it('should renew accessToken', async () => {
    const response = await request(app).post('/v1/user/token')
        .set('authorization', `Bearer ${refreshToken}`)
        .send();

    console.log(response.body);
    expect(response.statusCode).toBe(200);

    expect(response.body.code).toBe('200');
    expect(response.body.status).toBe('OK');
    expect(response.body.data.accessToken).toEqual(expect.any(String));
  });

  it('should return logout success', async () => {
    const responseLogout = await request(app).post('/v1/user/signout')
        .set('authorization', `Bearer ${refreshToken}`)
        .send();

    expect(responseLogout.statusCode).toBe(200);

    expect(responseLogout.body.code).toBe('200');
    expect(responseLogout.body.status).toBe('OK');
    expect(responseLogout.body.data.message).toBe('Sign out success');
  });

  afterAll(async () => {
    await knex('users').where('email', validUserRegister.email).del();
  });
});
