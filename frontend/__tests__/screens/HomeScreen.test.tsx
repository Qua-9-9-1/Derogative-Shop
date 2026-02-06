import { render } from '@testing-library/react-native';
import HomeScreen from '@/screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText(/home/i)).toBeTruthy();
  });
});
