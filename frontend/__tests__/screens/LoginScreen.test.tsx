import React from 'react';
import LoginScreen from '@/screens/LoginScreen';
import { render } from '@/utils/test-utils';

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {} },
    reset: jest.fn(),
  }),
  Controller: ({ render: renderProp }: any) => {
    const MockInput = renderProp({
      field: { onChange: jest.fn(), onBlur: jest.fn(), value: '', name: 'test' },
      fieldState: { error: null },
    });
    return MockInput;
  },
}));

// Mock services
jest.mock('@/services/authService', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('LoginScreen', () => {
  it('renders login form', () => {
    const { UNSAFE_root } = render(<LoginScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
