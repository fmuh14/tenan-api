const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const {
  getRecommendedTourisms,
} = require('../../controllers/tourismsController');

describe('getRecommendedTourisms', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should return recommended tourisms', async () => {
    const data = [1, 2, 3];
    const req = {body: {city: 'jakarta'}};
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    // Mock the Axios request
    mock.onPost(process.env.URL_ML_TOURISM).reply(
        200, {
          data: data, // Example predicted data
        });

    // Call the function
    await getRecommendedTourisms(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      code: '200',
      status: 'OK',
      data: expect.any(Array),
    });

    const responseData = res.send.mock.calls[0][0].data;
    expect(responseData.length).toBe(3);
  });

  it('should handle errors', async () => {
    const req = {body: {city: 'test-city'}};
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    // Mock the Axios request to simulate an error
    mock.onPost(process.env.URL_ML_TOURISM).reply(500);

    // Call the function
    await getRecommendedTourisms(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching predicted tourisms',
      },
    });
  });
});
