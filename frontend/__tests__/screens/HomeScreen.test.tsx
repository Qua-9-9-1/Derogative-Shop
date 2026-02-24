import { render } from '@/utils/test-utils';
import HomeScreen from '@/screens/HomeScreen';

jest.mock('@/services/productService', () => ({
  productService: {
    getAllProducts: jest.fn(() => Promise.resolve([])),
  },
}));

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText(/welcome/i)).toBeTruthy();
  });
});
