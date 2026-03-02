import { recommendationService } from '@/services/recommendationService';
import { apiClient } from '@/services/api';

jest.mock('@/services/api');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('recommendationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getRecommendations returns transformed product array', async () => {
    const mockData = [
      {
        id: '1',
        name: 'Product 1',
        brand: 'Brand A',
        imageUrl: 'img1.jpg',
        smallImageUrl: 'small1.jpg',
        stockQuantity: 10,
        price: 5.99,
        nutriscore: 'A',
        nutritionalInfo: { energy: '100kcal' },
      },
      {
        id: '2',
        name: 'Product 2',
        brand: 'Brand B',
        imageUrl: 'img2.jpg',
        smallImageUrl: 'small2.jpg',
        stockQuantity: 5,
        price: 3.49,
        nutriscore: 'B',
        nutritionalInfo: { energy: '80kcal' },
      },
    ];

    mockedApiClient.get.mockResolvedValue({ data: mockData } as any);

    const result = await recommendationService.getRecommendations();

    expect(mockedApiClient.get).toHaveBeenCalledWith('/recommendations');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: '1',
      name: 'Product 1',
      brands: 'Brand A',
      image_url: 'img1.jpg',
      small_image_url: 'small1.jpg',
      quantity: 10,
      price: 5.99,
      nutriscore: 'A',
      nutritional_info: { energy: '100kcal' },
    });
  });

  it('getRecommendations handles missing name with default', async () => {
    const mockData = [
      {
        id: '1',
        brand: 'Brand',
        imageUrl: 'img.jpg',
        smallImageUrl: 'small.jpg',
        stockQuantity: 5,
        price: 2.99,
      },
    ];

    mockedApiClient.get.mockResolvedValue({ data: mockData } as any);

    const result = await recommendationService.getRecommendations();

    expect(result[0].name).toBe('Unknown');
  });

  it('getRecommendations throws error on API failure', async () => {
    mockedApiClient.get.mockRejectedValue(new Error('API Error'));

    await expect(recommendationService.getRecommendations()).rejects.toThrow('API Error');
  });
});
