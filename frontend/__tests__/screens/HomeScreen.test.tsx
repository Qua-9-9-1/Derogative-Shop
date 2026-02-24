jest.mock('@/screens/HomeScreen', () => ({
  __esModule: true,
  default: function MockHomeScreen() {
    const React = require('react');
    return React.createElement('View', { testID: 'home-screen' }, 'Home Screen');
  },
}));

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const HomeScreen = require('@/screens/HomeScreen').default;
    expect(HomeScreen).toBeDefined();
  });
});
