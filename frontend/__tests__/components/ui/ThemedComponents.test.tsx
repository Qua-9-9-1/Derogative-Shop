import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

describe('Themed Components', () => {
  describe('ThemedText', () => {
    it('renders text correctly', () => {
      const { getByText } = render(<ThemedText>Test Text</ThemedText>);
      expect(getByText('Test Text')).toBeTruthy();
    });

    it('renders with default variant', () => {
      const { getByText } = render(<ThemedText type="default">Default</ThemedText>);
      expect(getByText('Default')).toBeTruthy();
    });

    it('renders with title variant', () => {
      const { getByText } = render(<ThemedText type="title">Title</ThemedText>);
      expect(getByText('Title')).toBeTruthy();
    });

    it('renders with defaultSemiBold variant', () => {
      const { getByText } = render(<ThemedText type="defaultSemiBold">Bold</ThemedText>);
      expect(getByText('Bold')).toBeTruthy();
    });

    it('renders with subtitle variant', () => {
      const { getByText } = render(<ThemedText type="subtitle">Subtitle</ThemedText>);
      expect(getByText('Subtitle')).toBeTruthy();
    });

    it('renders with link variant', () => {
      const { getByText } = render(<ThemedText type="link">Link</ThemedText>);
      expect(getByText('Link')).toBeTruthy();
    });
  });

  describe('ThemedView', () => {
    it('renders children correctly', () => {
      const { getByText } = render(
        <ThemedView>
          <ThemedText>Child Text</ThemedText>
        </ThemedView>
      );
      expect(getByText('Child Text')).toBeTruthy();
    });

    it('applies custom styles', () => {
      const { getByText } = render(
        <ThemedView style={{ padding: 10 }}>
          <ThemedText>Styled View</ThemedText>
        </ThemedView>
      );
      expect(getByText('Styled View')).toBeTruthy();
    });
  });

  describe('Collapsible', () => {
    it('renders with title', () => {
      const { getByText } = render(
        <Collapsible title="Test Title">
          <ThemedText>Content</ThemedText>
        </Collapsible>
      );
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('component is defined', () => {
      const { getByText } = render(
        <Collapsible title="Title">
          <ThemedText>Content</ThemedText>
        </Collapsible>
      );
      expect(getByText('Title')).toBeTruthy();
    });
  });
});
