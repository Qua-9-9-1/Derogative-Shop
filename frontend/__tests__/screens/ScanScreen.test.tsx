jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  },
}));
import { render } from '@testing-library/react-native';
import ScanScreen from '@/screens/ScanScreen';

describe('ScanScreen', () => {
  it('renders scan screen', () => {
    const { getByText } = render(<ScanScreen />);
    expect(getByText(/scan/i)).toBeTruthy();
  });
});
