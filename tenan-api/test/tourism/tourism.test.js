const request = require('supertest');
const app = require('../../index');
const {knex} = require('../../configs/data-source.js');
const validUserRegister = require('../auth/register.test.js');
// const validUserLogin = require('../auth/authentication.test.js');

describe('tourism', () => {
  beforeAll(async () => {
    await request(app).post('/v1/user/signup')
        .send(validUserRegister);
  });

  describe('get all tourism data', () => {
    it('should request using no query params', async () => {
      const response = await request(app).get('/v1/tourisms');

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
      const response = await request(app).get('/v1/tourisms')
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
      const response = await request(app).get('/v1/tourisms')
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
          const response = await request(app).get('/v1/tourisms')
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
      const q = 'moNuMen';
      const response = await request(app).get('/v1/tourisms')
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
          const response = await request(app).get('/v1/tourisms')
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
      const response = await request(app).get('/v1/tourisms')
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
          const response = await request(app).get('/v1/tourisms')
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

  describe('get detailed information about one tourism', () => {
    const expectResponseProperties = (response, tourismId) => {
      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data).toEqual(expect.any(Object));
      expect(response.body.data).toHaveProperty('tourism_id');
      expect(response.body.data.tourism_id).toBe(tourismId);
      expect(response.body.data).toHaveProperty('place_name');
      expect(response.body.data).toHaveProperty('rating');
      expect(response.body.data).toHaveProperty('category');
      expect(response.body.data).toHaveProperty('description');
      expect(response.body.data).toHaveProperty('longtitude');
      expect(response.body.data).toHaveProperty('latitude');
      expect(response.body.data).toHaveProperty('address');
      expect(response.body.data).toHaveProperty('city');
      expect(response.body.data).toHaveProperty('image_url');
      expect(response.body.data).toHaveProperty('favorited');
    };

    it('should return tourism info, but were not login', async () => {
      const tourismId = 5;
      const response = await request(app).get(`/v1/tourisms/${tourismId}`);

      expectResponseProperties(response, tourismId);
    });

    it('should return tourism info, but were login', async () => {
      const tourismId = 5;
      const response = await request(app).get(`/v1/tourisms/${tourismId}`);

      expectResponseProperties(response, tourismId);
    });
  });

  // Tourism not found

  afterAll(async () => {
    await knex('users').where('email', validUserRegister.email).del();
  });
});
