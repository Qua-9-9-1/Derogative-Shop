import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme, Icon } from 'react-native-paper';

interface ErrorContentProps {
  message?: string;
}

const ErrorContent: React.FC<ErrorContentProps> = ({ message = 'error' }) => {
  const theme = useTheme();
  
  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Icon source="alert-circle" size={48} color={theme.colors.error} />
      <Text variant="titleMedium" style={[styles.errorText, { color: theme.colors.error }]}>
        An error has occurred
      </Text>
      <Text variant="bodyMedium" style={[styles.messageText, { color: theme.colors.onSurfaceVariant }]}>
        {message}
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
  errorText: {
    fontWeight: '600',
    marginTop: 12,
  },
  messageText: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

export default ErrorContent;
