const request = require('supertest');
const app = require('../../index');
const {knex} = require('../../configs/data-source.js');
const {createTestUser} = require('../dataTest.js');

const {validUserLogin, validUserRegister} = createTestUser();

const expectResponseProperties = (response, lodgingId) => {
  expect(response.statusCode).toBe(200);

  expect(response.body.code).toBe('200');
  expect(response.body.status).toBe('OK');
  expect(response.body.data).toEqual(expect.any(Object));
  expect(response.body.data).toHaveProperty('lodging_id');
  expect(response.body.data.lodging_id).toBe(lodgingId);
  expect(response.body.data).toHaveProperty('place_name');
  expect(response.body.data).toHaveProperty('rating');
  expect(response.body.data).toHaveProperty('longtitude');
  expect(response.body.data).toHaveProperty('latitude');
  expect(response.body.data).toHaveProperty('address');
  expect(response.body.data).toHaveProperty('city');
  expect(response.body.data).toHaveProperty('image_url');
  expect(response.body.data).toHaveProperty('favorited');
};

describe('lodging', () => {
  beforeAll(async () => {
    await request(app).post('/v1/user/signup')
        .send(validUserRegister);
  });

  afterAll(async () => {
    await knex('users').where('email', validUserRegister.email).del();
  });

  describe('get all lodging data', () => {
    it('should request using no query params', async () => {
      const response = await request(app).get('/v1/lodgings');

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.current_page).toBe(1);
      expect(response.body.total_page).toBe(
          Math.ceil(response.body.total/10));
      expect(response.body.total).toBeGreaterThanOrEqual(1);
      expect(response.body.size).toBe(10);
      expect(response.body.data).toEqual(expect.any(Array));
    });

    it('should request using page params', async () => {
      const pageNumber = 2;
      const response = await request(app).get('/v1/lodgings')
          .query({
            'page': pageNumber,
          });

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.current_page).toBe(pageNumber);
      expect(response.body.total_page).toBe(
          Math.ceil(response.body.total/10));
      expect(response.body.total).toBeGreaterThanOrEqual(1);
      expect(response.body.size).toBe(10);
      expect(response.body.data).toEqual(expect.any(Array));
    });

    it('should request using page params but NaN', async () => {
      const pageNumber = 'JAJAJA';
      const response = await request(app).get('/v1/lodgings')
          .query({
            'page': pageNumber,
          });

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.current_page).toBe(1);
      expect(response.body.total_page).toBe(
          Math.ceil(response.body.total/10));
      expect(response.body.total).toBeGreaterThanOrEqual(1);
      expect(response.body.size).toBe(10);
      expect(response.body.data).toEqual(expect.any(Array));
    });

    it('should request using page query params but greater than total page',
        async () => {
          const pageNumber = 99999999;
          const response = await request(app).get('/v1/lodgings')
              .query({
                'page': pageNumber,
              });

          expect(response.statusCode).toBe(404);

          expect(response.body.code).toBe('404');
          expect(response.body.status).toBe('Not Found');
          expect(response.body.errors.message)
              .toBe('The requested page does not exist');
        });

    it('should request using q query params and found the result', async () => {
      const q = 'MuLiA';
      const response = await request(app).get('/v1/lodgings')
          .query({
            'q': q,
          });

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.current_page).toBe(1);
      expect(response.body.total_page).toBe(
          Math.ceil(response.body.total/10));
      expect(response.body.total).toBeGreaterThanOrEqual(1);
      expect(response.body.size).toBeGreaterThanOrEqual(1);
      expect(response.body.data).toEqual(expect.any(Array));
      expect(response.body.data[0].place_name.toLowerCase())
          .toEqual(expect.stringContaining(q.toLowerCase()));
    });

    it('should request using q query params and not found the result',
        async () => {
          const q = 'NOTFOUNDRESULT';
          const response = await request(app).get('/v1/lodgings')
              .query({
                'q': q,
              });

          expect(response.statusCode).toBe(404);

          expect(response.body.code).toBe('404');
          expect(response.body.status).toBe('Not Found');
          expect(response.body.errors.message)
              .toBe('Places not found in the database');
        });

    it('should request using city params and found the result', async () => {
      const city = 'JaKarTa';
      const response = await request(app).get('/v1/lodgings')
          .query({
            'city': city,
          });

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.current_page).toBe(1);
      expect(response.body.total_page).toBe(
          Math.ceil(response.body.total/10));
      expect(response.body.total).toBeGreaterThanOrEqual(1);
      expect(response.body.size).toBeGreaterThanOrEqual(1);
      expect(response.body.data).toEqual(expect.any(Array));
      expect(response.body.data[0].city.toLowerCase())
          .toEqual(city.toLowerCase());
    });

    it('should request using city query params and not found the result',
        async () => {
          const city = 'NOTFOUNDRESULT';
          const response = await request(app).get('/v1/lodgings')
              .query({
                'city': city,
              });

          expect(response.statusCode).toBe(404);

          expect(response.body.code).toBe('404');
          expect(response.body.status).toBe('Not Found');
          expect(response.body.errors.message)
              .toBe('City not found in the database');
        });
  });

  describe('get detailed information about one lodging', () => {
    it('should return lodging info, but were not login', async () => {
      const lodgingId = 5;
      const response = await request(app).get(`/v1/lodgings/${lodgingId}`);

      expectResponseProperties(response, lodgingId);
    });
  });

  describe('get detailed information about one lodging with auth', () => {
    let accessToken;
    beforeAll(async () => {
      const responseLogin = await request(app).post('/v1/user/signin')
          .send(validUserLogin);
      accessToken = responseLogin.body.data.accessToken;
    });

    it('should return lodging info', async () => {
      const lodgingId = 5;
      const response = await request(app).get(`/v1/lodgings/${lodgingId}`)
          .set('authorization', `Bearer ${accessToken}`);

      expectResponseProperties(response, lodgingId);
    });

    it('should return token invalid', async () => {
      const lodgingId = 5;
      const response = await request(app).get(`/v1/lodgings/${lodgingId}`)
          .set('authorization', `Bearer HAHAHAHAH`);

      expect(response.statusCode).toBe(401);

      expect(response.body.code).toBe('401');
      expect(response.body.status).toBe('Unauthorized');
      expect(response.body.errors.message)
          .toBe('Token invalid. Please sign in again');
    });
  });
});
