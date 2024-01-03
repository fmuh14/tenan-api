const request = require('supertest');
const app = require('../index');

it('Should say Welcome', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    code: '200',
    status: 'OK',
    message: 'Welcome to the Tenan API',
  });
});

it('Should return 404 Not Found', async () => {
  const response = await request(app).get('/404NotFound');
  expect(response.statusCode).toBe(404);
  expect(response.body).toEqual({
    code: '404',
    status: 'Not Found',
    errors: {
      message: 'The page or resource you\'re looking for could not be found.',
    },
  });
});
