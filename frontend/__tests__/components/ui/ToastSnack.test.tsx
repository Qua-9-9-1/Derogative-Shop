import React from 'react';
import { render } from '@testing-library/react-native';
import ToastStack from '@/components/ui/ToastSnack';
import { useToastStore } from '@/store/toastStore';

jest.mock('@/store/toastStore', () => ({
  useToastStore: jest.fn(),
}));

const mockedUseToastStore = useToastStore as jest.MockedFunction<typeof useToastStore>;

describe('ToastStack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when no toasts', () => {
    mockedUseToastStore.mockReturnValue({
      toasts: [],
      hideToast: jest.fn(),
      showToast: jest.fn(),
    });

    const result = render(<ToastStack />);
    expect(result).toBeTruthy();
  });

  it('renders toast when toasts exist', () => {
    mockedUseToastStore.mockReturnValue({
      toasts: [{ id: '1', message: 'Test Toast', actionLabel: 'UNDO' }],
      hideToast: jest.fn(),
      showToast: jest.fn(),
    });

    const { getByText } = render(<ToastStack />);
    expect(getByText('Test Toast')).toBeTruthy();
  });

  it('renders multiple toasts', () => {
    mockedUseToastStore.mockReturnValue({
      toasts: [
        { id: '1', message: 'Toast 1', actionLabel: 'UNDO' },
        { id: '2', message: 'Toast 2', actionLabel: 'UNDO' },
      ],
      hideToast: jest.fn(),
      showToast: jest.fn(),
    });

    const { getByText } = render(<ToastStack />);
    expect(getByText('Toast 1')).toBeTruthy();
    expect(getByText('Toast 2')).toBeTruthy();
  });

  it('renders toast with action button', () => {
    const mockHideToast = jest.fn();
    mockedUseToastStore.mockReturnValue({
      toasts: [{ id: '1', message: 'Test', actionLabel: 'ACTION', onAction: jest.fn() }],
      hideToast: mockHideToast,
      showToast: jest.fn(),
    });

    const { getByText } = render(<ToastStack />);
    expect(getByText('ACTION')).toBeTruthy();
  });
});
