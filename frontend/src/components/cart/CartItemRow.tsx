import React from 'react';
import { View } from 'react-native';
import { Card, IconButton, Surface, Text, useTheme } from 'react-native-paper';
import { CartItem } from '@/store/cartStore';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const CartItemRow = ({ item, onIncrement, onDecrement }: CartItemRowProps) => {
  const theme = useTheme();

  return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Content
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="bodySmall">{item.price} € / unit</Text>
        </View>

        <Surface
          elevation={0}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.secondaryContainer,
            borderRadius: 20,
            marginHorizontal: 10,
          }}
        >
          <IconButton icon="minus" size={16} onPress={onDecrement} />
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
            {item.quantity}
          </Text>
          <IconButton icon="plus" size={16} onPress={onIncrement} />
        </Surface>

        <Text
          variant="titleMedium"
          style={{ fontWeight: 'bold', minWidth: 60, textAlign: 'right' }}
        >
          {(item.price * item.quantity).toFixed(2)} €
        </Text>
      </Card.Content>
    </Card>
  );
};
