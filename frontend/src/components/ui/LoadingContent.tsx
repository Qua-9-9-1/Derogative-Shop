import React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Surface, Text, useTheme } from 'react-native-paper';

const LoadingContent: React.FC = () => {
  const theme = useTheme();

  return (
    <Surface style={styles.container}>
      <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
      <Text variant="bodyLarge" style={[styles.text, { color: theme.colors.onSurface }]}>
        Loading...
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
  },
});

export default LoadingContent;
