const express = require('express');
const request = require('supertest');

const app = express();

app.get('/', (req, res, next) => {
  res.send('Hello!');
});

it('Should say Hello!', async () => {
  const response = await request(app).get('/');
  expect(response.text).toBe('Hello!');
});
