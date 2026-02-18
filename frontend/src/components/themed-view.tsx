import { type ViewProps } from 'react-native';
import { Surface } from 'react-native-paper';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  elevation?: number;
};

export function ThemedView({ style, lightColor, darkColor, elevation = 0, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <Surface elevation={elevation} style={[{ backgroundColor }, style]} {...otherProps} />;
}
