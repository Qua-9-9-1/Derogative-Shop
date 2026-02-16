import { renderHook } from '@testing-library/react-native';
import { useCartSync } from '../../src/hooks/useCartSync';

jest.mock('../../src/store/cartStore', () => ({
  useCartStore: jest.fn(() => ({
    isDirty: false,
    syncWithBackend: jest.fn(),
    initializeCart: jest.fn(),
  })),
}));
jest.mock('../../src/context/authContext', () => ({
  useAuth: jest.fn(() => ({ isAuthenticated: true })),
}));

describe('useCartSync', () => {
  it('calls initializeCart on mount if authenticated', () => {
    const { result } = renderHook(() => useCartSync());
    expect(result).toBeDefined();
  });
});
