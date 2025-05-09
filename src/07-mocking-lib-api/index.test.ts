import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  let mockGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGet = jest
      .fn()
      .mockResolvedValue({ data: { id: 1, title: 'Test Data' } });

    (axios.create as jest.Mock) = jest.fn().mockReturnValue({
      get: mockGet,
      defaults: {},
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
      },
      getUri: jest.fn(),
      request: jest.fn(),
      delete: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
      patch: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
    });
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/posts/1');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const path = '/posts/1';
    await throttledGetDataFromApi(path);

    expect(mockGet).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const mockData = { id: 1, title: 'Test Data' };
    mockGet.mockResolvedValue({ data: mockData });

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(mockData);
  });
});
