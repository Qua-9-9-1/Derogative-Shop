import { cartService } from '../../src/services/cartService';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('cartService', () => {
  it('should have getCart function', () => {
    expect(typeof cartService.getCart).toBe('function');
  });

  it('getCart returns data', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { items: [{ id: '1', name: 'Test', price: 10, quantity: 1 }] },
    });
    const res = await cartService.getCart();
    expect(res.items.length).toBe(1);
  });

  it('syncCart calls axios.put', async () => {
    mockedAxios.put.mockResolvedValueOnce({});
    await cartService.syncCart([{ id: '1', name: 'Test', price: 10, quantity: 1 }]);
    expect(mockedAxios.put).toHaveBeenCalled();
  });
});
