import React from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Button, Card, IconButton, Surface, Text, useTheme } from 'react-native-paper';
import { CartItem, useCartStore } from '../store/cartStore';

export default function CartScreen() {
  const theme = useTheme();
  const { items,addItem, updateQuantity, clearCart, totalPrice } = useCartStore();

  const handlePayment = () => {
    if (items.length === 0) return;
    Alert.alert('Payment', `Test pay`);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <Card style={{ marginBottom: 10 }}>
      <Card.Content
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium">{item.name}</Text>
          <Text variant="bodySmall">{item.price} € / by product </Text>
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
          <IconButton icon="minus" size={16} onPress={() => updateQuantity(item.id, item.quantity - 1)} />
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
            {item.quantity}
          </Text>
          <IconButton icon="plus" size={16} onPress={() => addItem(item)} />
        </Surface>

        <Text
          variant="titleMedium"
          style={{ fontWeight: 'bold', minWidth: 50, textAlign: 'right' }}
        >
          {(item.price * item.quantity).toFixed(2)} €
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50, opacity: 0.5 }}>
            Your cart is empty. Add some products to see them here!
          </Text>
        }
      />

      {items.length > 0 && (
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
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.primary, fontWeight: 'bold' }}
            >
              {totalPrice().toFixed(2)} €
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handlePayment}
            style={{ marginBottom: 10 }}
            contentStyle={{ paddingVertical: 5 }}
          >
            Pay now
          </Button>

          <Button mode="text" onPress={clearCart} textColor={theme.colors.error}>
            Empty cart
          </Button>
        </Surface>
      )}
    </Surface>
  );
}
