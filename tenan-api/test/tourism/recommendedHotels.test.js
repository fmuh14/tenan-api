const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const {
  getRecommendedHotels,
} = require('../../controllers/tourismsController');

describe('getRecommendedHotels', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should return recommended hotels', async () => {
    const data = ['The Sultan Hotel Jakarta',
      'Aryaduta Suite Semanggi',
      'Hotel Mulia Senayan, Jakarta'];
    const req = {body: {
      longtitude: -77.0364,
      latitude: 38.8951,
    }};
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    // Mock the Axios request
    mock.onPost(process.env.URL_ML_HOTEL).reply(
        200, {
          data: data, // Example predicted data
        });

    // Call the function
    await getRecommendedHotels(req, res);

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
    mock.onPost(process.env.URL_ML_HOTEL).reply(500);

    // Call the function
    await getRecommendedHotels(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching predicted hotel',
      },
    });
  });
});
