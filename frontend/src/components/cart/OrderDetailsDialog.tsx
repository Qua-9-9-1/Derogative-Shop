import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Dialog, Divider, Portal, Text, useTheme } from 'react-native-paper';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'paid' | 'pending';
  items: OrderItem[];
}

interface OrderDetailsDialogProps {
  visible: boolean;
  order: Order | null;
  onDismiss: () => void;
}

export const OrderDetailsDialog = ({ visible, order, onDismiss }: OrderDetailsDialogProps) => {
  const theme = useTheme();

  if (!order) return null;
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={{ maxHeight: '80%' }}>
        <Dialog.Title>Order Details #{order.id}</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
            <Text variant="bodyMedium" style={{ marginBottom: 15, opacity: 0.6 }}>
              Date: {order.date}
            </Text>

            <Divider />

            {order.items.map((item, index) => (
              <View key={index}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Text>
                    <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                      {item.unitPrice.toFixed(2)} € x {item.quantity}
                    </Text>
                  </View>
                  <Text variant="bodyLarge" style={{ alignSelf: 'center' }}>
                    {(item.unitPrice * item.quantity).toFixed(2)} €
                  </Text>
                </View>
                <Divider />
              </View>
            ))}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                TOTAL
              </Text>
              <Text
                variant="titleMedium"
                style={{ fontWeight: 'bold', color: theme.colors.primary }}
              >
                {order.total.toFixed(2)} €
              </Text>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
