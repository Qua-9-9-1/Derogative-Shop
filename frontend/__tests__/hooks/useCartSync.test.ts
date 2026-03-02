import { renderHook, waitFor } from '@testing-library/react-native';
import { useCartSync } from '../../src/hooks/useCartSync';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/authContext';

const mockSyncWithBackend = jest.fn();
const mockInitializeCart = jest.fn();

jest.mock('../../src/store/cartStore');
jest.mock('../../src/context/authContext');

const mockedUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useCartSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls initializeCart on mount if authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      token: 'test',
      userId: '1',
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockedUseCartStore.mockReturnValue({
      items: [],
      isDirty: false,
      isLoading: false,
      syncWithBackend: mockSyncWithBackend,
      initializeCart: mockInitializeCart,
      addItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getItemCount: jest.fn(),
      totalPrice: jest.fn(),
    });

    renderHook(() => useCartSync());

    expect(mockInitializeCart).toHaveBeenCalled();
  });

  it('does not call initializeCart when not authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      userId: null,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockedUseCartStore.mockReturnValue({
      items: [],
      isDirty: false,
      isLoading: false,
      syncWithBackend: mockSyncWithBackend,
      initializeCart: mockInitializeCart,
      addItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getItemCount: jest.fn(),
      totalPrice: jest.fn(),
    });

    renderHook(() => useCartSync());

    expect(mockInitializeCart).not.toHaveBeenCalled();
  });

  it('syncs cart after 2 seconds when dirty and authenticated', async () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      token: 'test',
      userId: '1',
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockedUseCartStore.mockReturnValue({
      items: [],
      isDirty: true,
      isLoading: false,
      syncWithBackend: mockSyncWithBackend,
      initializeCart: mockInitializeCart,
      addItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getItemCount: jest.fn(),
      totalPrice: jest.fn(),
    });

    renderHook(() => useCartSync());

    expect(mockSyncWithBackend).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockSyncWithBackend).toHaveBeenCalled();
    });
  });
});
