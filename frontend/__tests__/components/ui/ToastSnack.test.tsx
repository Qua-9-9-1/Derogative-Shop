jest.mock('react-native/Libraries/Animated/AnimatedImplementation', () => {
  return {
    ...jest.requireActual('react-native/Libraries/Animated/AnimatedImplementation'),
    timing: () => ({
      start: jest.fn(),
    }),
    parallel: () => ({
      start: jest.fn(),
    }),
  };
});
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import ToastStack from '@/components/ui/ToastSnack';
import { useToastStore } from '@/store/toastStore';

jest.mock('react-native-paper', () => {
  const Real = jest.requireActual('react-native-paper');
  return {
    ...Real,
    useTheme: () => ({ colors: { primaryContainer: '#fff' } }),
  };
});

describe('ToastStack', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('renders nothing if no toast', () => {
    const { toJSON } = render(<ToastStack />);
    expect(toJSON()).toBeNull();
  });

  it('renders a toast message', () => {
    useToastStore.setState({
      toasts: [{ id: '1', message: 'Hello', actionLabel: 'OK' }],
    });
    const { getByText } = render(<ToastStack />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('calls onAction and hides toast', () => {
    const onAction = jest.fn();
    useToastStore.setState({
      toasts: [{ id: '2', message: 'Action', actionLabel: 'UNDO', onAction }],
    });
    const { getByText } = render(<ToastStack />);
    fireEvent.press(getByText('UNDO'));
    expect(onAction).toHaveBeenCalled();
  });
});
