import React from 'react';
import { render, waitFor } from '@/utils/test-utils';
import UserScreen from '@/screens/UserScreen';

jest.mock('@/components/ui/LoadingContent', () => () => <></>);
jest.mock('@/components/ui/ErrorContent', () => ({ message }: any) => <>{message}</>);

describe('UserScreen', () => {
  it('renders user info', async () => {
    const { getByText } = render(<UserScreen />);
    await waitFor(() => {
      expect(getByText('Bonjour Test !')).toBeTruthy();
      expect(getByText('Email : test@example.com')).toBeTruthy();
    });
  });
});
