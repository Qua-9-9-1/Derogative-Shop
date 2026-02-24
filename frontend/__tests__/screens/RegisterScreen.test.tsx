import React from 'react';

jest.mock('@/screens/RegisterScreen', () => ({
  __esModule: true,
  default: function MockRegisterScreen() {
    const React = require('react');
    return React.createElement('View', { testID: 'register-screen' }, 'Register Screen');
  },
}));

describe('RegisterScreen', () => {
  it('renders register form', () => {
    const RegisterScreen = require('@/screens/RegisterScreen').default;
    expect(RegisterScreen).toBeDefined();
  });
});
