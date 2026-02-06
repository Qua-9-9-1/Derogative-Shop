import { render } from '@testing-library/react-native';
import LoginScreen from '@/screens/LoginScreen';

describe('LoginScreen', () => {
  it('renders login form', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/password/i)).toBeTruthy();
  });
});
