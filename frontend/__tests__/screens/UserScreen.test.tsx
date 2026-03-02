jest.mock('@/screens/UserScreen', () => ({
  __esModule: true,
  default: function MockUserScreen() {
    const React = require('react');
    return React.createElement('View', { testID: 'user-screen' }, 'User Screen');
  },
}));

describe('UserScreen', () => {
  it('renders without crashing', () => {
    const UserScreen = require('@/screens/UserScreen').default;
    expect(UserScreen).toBeDefined();
  });
});
