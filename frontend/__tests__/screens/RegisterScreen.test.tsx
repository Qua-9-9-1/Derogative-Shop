import { render } from '@testing-library/react-native';
import RegisterScreen from '@/screens/RegisterScreen';

describe('RegisterScreen', () => {
  it('renders register form', () => {
    const { getAllByTestId } = render(<RegisterScreen />);
    const inputs = getAllByTestId('text-input-outlined');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });
});
