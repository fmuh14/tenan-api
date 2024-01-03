const request = require('supertest');
const app = require('../../index');
const {knex} = require('../../configs/data-source.js');
const {createTestUser} = require('../dataTest.js');

const {validUserLogin, validUserRegister} = createTestUser();

describe('user profile', () => {
  describe('given the access token is valid', () => {
    let accessToken;
    beforeAll(async () => {
      await request(app).post('/v1/user/signup')
          .send(validUserRegister);
      const responseLogin = await request(app).post('/v1/user/signin')
          .send(validUserLogin);
      accessToken = responseLogin.body.data.accessToken;
    });

    afterAll(async () => {
      await knex('users').where('email', validUserRegister.email).del();
    });

    it('should return user profile', async () => {
      const response = await request(app).get(`/v1/user/my-profile`)
          .set('authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data).toEqual(expect.any(Object));
      expect(response.body.data.user_id).toEqual(expect.any(Number));
      expect(response.body.data.name).toBe(validUserRegister.name);
      expect(response.body.data.email).toBe(validUserRegister.email);
    });

    it('should return user favorite tourism but no favorited added',
        async () => {
          const response = await request(app)
              .get(`/v1/user/my-favorites-tourisms`)
              .set('authorization', `Bearer ${accessToken}`);

          expect(response.statusCode).toBe(200);

          expect(response.body.code).toBe('200');
          expect(response.body.status).toBe('OK');
          expect(response.body.data).toEqual(expect.any(Object));
          expect(response.body.data.message).toBe('No favorite tourisms added');
        });

    it('should return user favorite hotel but no favorited added', async () => {
      const response = await request(app).get(`/v1/user/my-favorites-lodgings`)
          .set('authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data).toEqual(expect.any(Object));
      expect(response.body.data.message).toBe('No favorite lodgings added');
    });

    it('should add user favorited tourism', async () => {
      const favoriteTourismId = 5;
      const response = await request(app).post(`/v1/user/my-favorites-tourisms`)
          .set('authorization', `Bearer ${accessToken}`).send({
            tourism_id: favoriteTourismId,
          });

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data).toEqual(expect.any(Object));
      expect(response.body.data.message).toBe('Added to favorites');
    });

    it('should add user favorited hotel', async () => {
      const favoriteLodgingId = 5;
      const response = await request(app).post(`/v1/user/my-favorites-lodgings`)
          .set('authorization', `Bearer ${accessToken}`).send({
            lodging_id: favoriteLodgingId,
          });

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data).toEqual(expect.any(Object));
      expect(response.body.data.message).toBe('Added to favorites');
    });

    it('should return error because we already added the favorited tourism',
        async () => {
          const favoriteTourismId = 5;
          const response = await request(app)
              .post(`/v1/user/my-favorites-tourisms`)
              .set('authorization', `Bearer ${accessToken}`).send({
                tourism_id: favoriteTourismId,
              });

          expect(response.statusCode).toBe(409);

          expect(response.body.code).toBe('409');
          expect(response.body.status).toBe('Conflict');
          expect(response.body.errors).toEqual(expect.any(Object));
          expect(response.body.errors.message).toBe(
              'the tourism ID you provided already added to your favorites');
        });

    it('should return error because we already added the favorited lodging',
        async () => {
          const favoriteLodgingId = 5;
          const response = await request(app)
              .post(`/v1/user/my-favorites-lodgings`)
              .set('authorization', `Bearer ${accessToken}`).send({
                lodging_id: favoriteLodgingId,
              });

          expect(response.statusCode).toBe(409);

          expect(response.body.code).toBe('409');
          expect(response.body.status).toBe('Conflict');
          expect(response.body.errors).toEqual(expect.any(Object));
          expect(response.body.errors.message).toBe(
              'the lodging ID you provided already added to your favorites');
        });

    it('should return 404 error because the tourism_id do not exists',
        async () => {
          const favoriteTourismId = 999999;
          const response = await request(app)
              .post(`/v1/user/my-favorites-tourisms`)
              .set('authorization', `Bearer ${accessToken}`).send({
                tourism_id: favoriteTourismId,
              });

          expect(response.statusCode).toBe(404);

          expect(response.body.code).toBe('404');
          expect(response.body.status).toBe('Not Found');
          expect(response.body.errors).toEqual(expect.any(Object));
          expect(response.body.errors.message).toBe(
              'the tourism ID you provided does not exist in our records');
        });

    it('should return error because the lodging_id do not exists',
        async () => {
          const favoriteLodgingId = 999999;
          const response = await request(app)
              .post(`/v1/user/my-favorites-lodgings`)
              .set('authorization', `Bearer ${accessToken}`).send({
                lodging_id: favoriteLodgingId,
              });

          expect(response.statusCode).toBe(404);

          expect(response.body.code).toBe('404');
          expect(response.body.status).toBe('Not Found');
          expect(response.body.errors).toEqual(expect.any(Object));
          expect(response.body.errors.message).toBe(
              'the lodging ID you provided does not exist in our records');
        });

    it('should return user favorite tourism', async () => {
      const response = await request(app).get(`/v1/user/my-favorites-tourisms`)
          .set('authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data).toEqual(expect.any(Array));

      const dataItem = response.body.data[0];
      expect(dataItem).toBeDefined();
      expect(dataItem).toHaveProperty('tourism_id');
      expect(dataItem).toHaveProperty('place_name');
      expect(dataItem).toHaveProperty('rating');
      expect(dataItem).toHaveProperty('city');
      expect(dataItem).toHaveProperty('category');
      expect(dataItem).toHaveProperty('longtitude');
      expect(dataItem).toHaveProperty('latitude');
      expect(dataItem).toHaveProperty('image_url');
    });

    it('should return user favorite hotel', async () => {
      const response = await request(app).get(`/v1/user/my-favorites-lodgings`)
          .set('authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data).toEqual(expect.any(Array));

      const dataItem = response.body.data[0];
      expect(dataItem).toBeDefined();
      expect(dataItem).toHaveProperty('lodging_id');
      expect(dataItem).toHaveProperty('place_name');
      expect(dataItem).toHaveProperty('rating');
      expect(dataItem).toHaveProperty('city');
      expect(dataItem).toHaveProperty('image_url');
    });

    it('should delete user favorited tourism', async () => {
      const favoriteTourismId = 5;
      const response = await request(app)
          .delete(`/v1/user/my-favorites-tourisms/${favoriteTourismId}`)
          .set('authorization', `Bearer ${accessToken}`).send({
            tourism_id: favoriteTourismId,
          });

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data).toEqual(expect.any(Object));
      expect(response.body.data.message).toBe('Removed from favorites');
    });

    it('should delete user favorited hotel', async () => {
      const favoriteLodgingId = 5;
      const response = await request(app)
          .delete(`/v1/user/my-favorites-lodgings/${favoriteLodgingId}`)
          .set('authorization', `Bearer ${accessToken}`).send({
            lodging_id: favoriteLodgingId,
          });

      expect(response.statusCode).toBe(200);

      expect(response.body.code).toBe('200');
      expect(response.body.status).toBe('OK');
      expect(response.body.data).toEqual(expect.any(Object));
      expect(response.body.data.message).toBe('Removed from favorites');
    });

    it('should return error because the tourism_id do not exists', async () => {
      const favoriteTourismId = 99999;
      const response = await request(app)
          .delete(`/v1/user/my-favorites-tourisms/${favoriteTourismId}`)
          .set('authorization', `Bearer ${accessToken}`).send({
            tourism_id: favoriteTourismId,
          });

      expect(response.statusCode).toBe(404);

      expect(response.body.code).toBe('404');
      expect(response.body.status).toBe('Not Found');
      expect(response.body.errors).toEqual(expect.any(Object));
      expect(response.body.errors.message)
          .toBe('the tourism ID you provided does not exist in our records');
    });

    it('should return error because the lodging_id do not exists', async () => {
      const favoriteLodgingId = 99999;
      const response = await request(app)
          .delete(`/v1/user/my-favorites-lodgings/${favoriteLodgingId}`)
          .set('authorization', `Bearer ${accessToken}`).send({
            lodging_id: favoriteLodgingId,
          });

      expect(response.statusCode).toBe(404);

      expect(response.body.code).toBe('404');
      expect(response.body.status).toBe('Not Found');
      expect(response.body.errors).toEqual(expect.any(Object));
      expect(response.body.errors.message)
          .toBe('the lodging ID you provided does not exist in our records');
    });
  });

  describe('given the access token is invalid', () => {
    it('should return no token provided', async () => {
      const response = await request(app).get('/v1/user/my-profile')
          .send();

      expect(response.statusCode).toBe(401);

      expect(response.body.code).toBe('401');
      expect(response.body.status).toBe('Unauthorized');
      expect(response.body.errors.message).toBe('No token provided');
    });

    it('should return no token invalid', async () => {
      const response = await request(app).get('/v1/user/my-profile')
          .set('authorization', `Bearer HAHAHAHAHA`);

      expect(response.statusCode).toBe(401);

      expect(response.body.code).toBe('401');
      expect(response.body.status).toBe('Unauthorized');
      expect(response.body.errors.message).toBe('Token invalid');
    });
  });
});

