import { paymentService } from '@/services/paymentService';
import { apiClient } from '@/services/api';

jest.mock('@/services/api');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('paymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createOrder calls API and returns order data', async () => {
    const mockOrderData = { orderId: 'ORDER123', approvalUrl: 'https://paypal.com/approve' };
    mockedApiClient.post.mockResolvedValue({ data: mockOrderData } as any);

    const result = await paymentService.createOrder();

    expect(mockedApiClient.post).toHaveBeenCalledWith('/orders/create');
    expect(result).toEqual(mockOrderData);
  });

  it('createOrder throws error on failure', async () => {
    mockedApiClient.post.mockRejectedValue(new Error('Payment creation failed'));

    await expect(paymentService.createOrder()).rejects.toThrow('Payment creation failed');
  });

  it('captureOrder calls API with paypalOrderId', async () => {
    const mockCaptureData = { success: true, captureId: 'CAPTURE123' };
    mockedApiClient.post.mockResolvedValue({ data: mockCaptureData } as any);

    const result = await paymentService.captureOrder('PAYPAL123');

    expect(mockedApiClient.post).toHaveBeenCalledWith('/orders/capture', { 
      paypalOrderId: 'PAYPAL123' 
    });
    expect(result).toEqual(mockCaptureData);
  });

  it('captureOrder throws error on failure', async () => {
    mockedApiClient.post.mockRejectedValue(new Error('Capture failed'));

    await expect(paymentService.captureOrder('ORDER123')).rejects.toThrow('Capture failed');
  });

  it('getOrderHistory returns order array', async () => {
    const mockOrders = [
      { id: '1', total: 50.00, status: 'completed' },
      { id: '2', total: 30.00, status: 'pending' },
    ];
    mockedApiClient.get.mockResolvedValue({ data: mockOrders } as any);

    const result = await paymentService.getOrderHistory();

    expect(mockedApiClient.get).toHaveBeenCalledWith('/orders');
    expect(result).toEqual(mockOrders);
  });

  it('getOrderHistory throws error on failure', async () => {
    mockedApiClient.get.mockRejectedValue(new Error('Fetch failed'));

    await expect(paymentService.getOrderHistory()).rejects.toThrow('Fetch failed');
  });
});
