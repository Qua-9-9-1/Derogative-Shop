import React from 'react';
import { View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

interface CartSummaryProps {
  total: number;
  onPay: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

export const CartSummary = ({ total, onPay, onClear, isLoading = false }: CartSummaryProps) => {
  const theme = useTheme();

  return (
    <Surface
      elevation={4}
      style={{ padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
        }}
      >
        <Text variant="titleLarge">Total</Text>
        <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          {total.toFixed(2)} €
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={onPay}
        style={{ marginBottom: 10 }}
        contentStyle={{ paddingVertical: 5 }}
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Checking stock...' : 'Pay now'}
      </Button>
      <Button mode="text" onPress={onClear} textColor={theme.colors.error}>
        Empty cart
      </Button>
    </Surface>
  );
};
