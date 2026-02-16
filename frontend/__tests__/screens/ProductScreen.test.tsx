import React from 'react';
import { render } from '@testing-library/react-native';
import ProductScreen from '../../src/screens/ProductScreen';

describe('ProductScreen', () => {
  it('renders without crashing', () => {
    render(<ProductScreen />);
  });
});
