import React from 'react';
import LoginScreen from '@/screens/LoginScreen';
import { render } from '@/utils/test-utils';

describe('LoginScreen', () => {
  it('renders login form', () => {
    const { getAllByTestId } = render(<LoginScreen />);
    const inputs = getAllByTestId('text-input-outlined');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });
});
