import { StyleSheet, type TextProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ReactNode } from 'react';

export type ThemedTextProps = Omit<TextProps, 'children'> & {
  children: ReactNode;
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const theme = useTheme();

  const getVariant = () => {
    switch (type) {
      case 'title':
        return 'headlineLarge';
      case 'subtitle':
        return 'headlineSmall';
      case 'defaultSemiBold':
        return 'bodyLarge';
      case 'link':
        return 'bodyLarge';
      default:
        return 'bodyMedium';
    }
  };

  return (
    <Text
      variant={getVariant()}
      style={[
        { color },
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'link' && { color: theme.colors.primary },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  defaultSemiBold: {
    fontWeight: '600',
  },
});
