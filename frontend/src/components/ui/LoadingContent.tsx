import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingContent: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#622be4" />
      <Text style={styles.text}>loading</Text>
    </View>
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
    fontSize: 16,
    color: '#333',
  },
});

export default LoadingContent;
