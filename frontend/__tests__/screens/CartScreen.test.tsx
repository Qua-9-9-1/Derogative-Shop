import { render } from '@testing-library/react-native';
import CartScreen from '@/screens/CartScreen';

describe('CartScreen', () => {
  it('renders cart', () => {
    const { getByText } = render(<CartScreen />);
    expect(getByText(/cart/i)).toBeTruthy();
  });
});
