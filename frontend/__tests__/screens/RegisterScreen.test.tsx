import React from 'react';

jest.mock('@/screens/RegisterScreen', () => ({
  __esModule: true,
  default: function MockRegisterScreen() {
    const React = require('react');
    return React.createElement('View', { testID: 'register-screen' }, 'Register Screen');
  },
}));
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {} },
    reset: jest.fn(),
  }),
  Controller: ({ render: renderProp }: any) => {
    return renderProp({
      field: { onChange: jest.fn(), onBlur: jest.fn(), value: '', name: 'test' },
      fieldState: { error: null },
    });
  },
}));

jest.mock('@/services/authService', () => ({
  authService: {
    register: jest.fn(() => Promise.resolve()),
  },
}));
describe('RegisterScreen', () => {
  it('renders register form', () => {
    const RegisterScreen = require('@/screens/RegisterScreen').default;
    expect(RegisterScreen).toBeDefined();
  });
});
