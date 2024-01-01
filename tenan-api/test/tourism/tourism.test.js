// const request = require('supertest');
// const app = require('../../index');
// const {knex} = require('../../configs/data-source.js');

// describe('tourism menu', () => {
//   beforeAll(async () => {
//     const response = await request(app).post('/v1/user/signup')
//         .send(validUserRegister);
//     const refreshToken = response.body.data.refreshToken;
//   });

//   describe('Get all tourism data', () => {
//     it('should request using no query params and return all tourism data',
//         async () => {
//           const response = await request(app).post('/v1/tourisms');

//           expect(response.statusCode).toBe(200);

//           expect(response.body.code).toBe('200');
//           expect(response.body.status).toBe('OK');
//           expect(response.body.current_page).toBe(1);
//           expect(response.body.total_page).toBe(44);
//           expect(response.body.total).toBe(437);
//           expect(response.body.size).toBe(10);
//           expect(response.body.data).toEqual(expect.any(Array));
//         });
//   });

//   afterAll(async () => {
//     await knex('users').where('email', validUserRegister.email).del();
//   });
// });
