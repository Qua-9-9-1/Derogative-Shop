import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import UserScreen from '../../src/screens/UserScreen';

jest.mock('../../src/context/authContext', () => ({
  useAuth: jest.fn(() => ({ userId: '1', token: 'token', logout: jest.fn() })),
}));
jest.mock('../../src/services/userService', () => ({
  userService: {
    getUserProfile: jest.fn(() => Promise.resolve({ firstName: 'John', email: 'john@email.com' })),
  },
}));
jest.mock('../../src/components/ui/LoadingContent', () => () => <></>);
jest.mock('../../src/components/ui/ErrorContent', () => ({ message }: any) => <>{message}</>);

describe('UserScreen', () => {
  it('renders user info', async () => {
    const { getByText } = render(<UserScreen />);
    await waitFor(() => {
      expect(getByText('Bonjour John !')).toBeTruthy();
      expect(getByText('Email : john@email.com')).toBeTruthy();
    });
  });
});
