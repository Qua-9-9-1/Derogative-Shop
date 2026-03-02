import { act } from '@testing-library/react-native';

jest.unmock('@/store/toastStore');
const { useToastStore } = require('@/store/toastStore');

jest.useFakeTimers();

describe('useToastStore', () => {
  beforeEach(() => {
    act(() => {
      useToastStore.setState({ toasts: [] });
    });
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('initializes with empty toasts array', () => {
    const state = useToastStore.getState();
    expect(state.toasts).toEqual([]);
  });

  it('adds toast when showToast is called', () => {
    act(() => {
      useToastStore.getState().showToast('Test message');
    });

    const state = useToastStore.getState();
    expect(state.toasts.length).toBe(1);
    expect(state.toasts[0].message).toBe('Test message');
    expect(state.toasts[0].actionLabel).toBe('UNDO');
  });

  it('adds toast with action callback', () => {
    const mockAction = jest.fn();

    act(() => {
      useToastStore.getState().showToast('Test message', mockAction);
    });

    const state = useToastStore.getState();
    expect(state.toasts[0].onAction).toBe(mockAction);
  });

  it('removes toast with hideToast', () => {
    let toastId: string;

    act(() => {
      useToastStore.getState().showToast('Test message');
    });

    toastId = useToastStore.getState().toasts[0].id;

    act(() => {
      useToastStore.getState().hideToast(toastId);
    });

    const state = useToastStore.getState();
    expect(state.toasts.length).toBe(0);
  });

  it('auto-removes toast after timeout', () => {
    act(() => {
      useToastStore.getState().showToast('Test message');
    });

    expect(useToastStore.getState().toasts.length).toBe(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(useToastStore.getState().toasts.length).toBe(0);
  });

  it('handles multiple toasts', () => {
    act(() => {
      useToastStore.getState().showToast('Message 1');
      useToastStore.getState().showToast('Message 2');
    });

    const state = useToastStore.getState();
    expect(state.toasts.length).toBe(2);
    expect(state.toasts[0].message).toBe('Message 1');
    expect(state.toasts[1].message).toBe('Message 2');
  });

  it('removes only expired toast after timeout', () => {
    act(() => {
      useToastStore.getState().showToast('Message 1');
    });

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    act(() => {
      useToastStore.getState().showToast('Message 2');
    });

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    const state = useToastStore.getState();
    expect(state.toasts.length).toBe(1);
    expect(state.toasts[0].message).toBe('Message 2');
  });
});
