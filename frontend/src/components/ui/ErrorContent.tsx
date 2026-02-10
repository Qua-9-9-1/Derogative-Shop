import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorContentProps {
  message?: string;
}

const ErrorContent: React.FC<ErrorContentProps> = ({ message = 'error' }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={48} color="#EF4444" />
      <Text style={styles.errorText}>An error has occurred</Text>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

export default ErrorContent;
