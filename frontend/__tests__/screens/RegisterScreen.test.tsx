import { render } from '@testing-library/react-native';
import RegisterScreen from '@/screens/RegisterScreen';

describe('RegisterScreen', () => {
  it('renders register form', () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/password/i)).toBeTruthy();
  });
});
