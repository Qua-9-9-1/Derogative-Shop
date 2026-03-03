import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingContent from '@/components/ui/LoadingContent';
import ErrorContent from '@/components/ui/ErrorContent';

describe('UI Components', () => {
  describe('LoadingContent', () => {
    it('renders loading message', () => {
      const { getByText } = render(<LoadingContent message="Loading..." />);
      expect(getByText('Loading...')).toBeTruthy();
    });

    it('renders default loading message', () => {
      const { getByText } = render(<LoadingContent />);
      expect(getByText('Loading...')).toBeTruthy();
    });
  });

  describe('ErrorContent', () => {
    it('renders error message', () => {
      const { getByText } = render(<ErrorContent message="Error occurred" />);
      expect(getByText('Error occurred')).toBeTruthy();
    });

    it('renders with retry button', () => {
      const onRetry = jest.fn();
      const { getByText } = render(<ErrorContent message="Error" onRetry={onRetry} />);

      expect(getByText('Error')).toBeTruthy();
    });
  });
});
