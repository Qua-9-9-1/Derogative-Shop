import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Chip, Text, useTheme } from 'react-native-paper';
import { Order, OrderDetailsDialog } from './OrderDetailsDialog';

const MOCK_HISTORY: Order[] = [
  {
    id: 'ORD-001',
    date: '2023-10-24',
    total: 12.5,
    status: 'paid',
    items: [
      { id: 'p1', name: 'Nutella 750g', quantity: 2, unitPrice: 4.5 },
      { id: 'p2', name: 'Baguette', quantity: 1, unitPrice: 1.2 },
      { id: 'p3', name: 'Milk 1L', quantity: 2, unitPrice: 1.15 },
    ],
  },
  {
    id: 'ORD-002',
    date: '2023-10-20',
    total: 45.9,
    status: 'paid',
    items: [
      { id: 'p4', name: 'Coca Cola Pack', quantity: 2, unitPrice: 8.5 },
      { id: 'p5', name: 'Pizza Regina', quantity: 3, unitPrice: 4.5 },
      { id: 'p6', name: 'Chips', quantity: 5, unitPrice: 1.8 },
      { id: 'p7', name: 'Water Pack', quantity: 1, unitPrice: 2.4 },
    ],
  },
  {
    id: 'ORD-003',
    date: '2023-09-15',
    total: 8.2,
    status: 'paid',
    items: [{ id: 'p8', name: 'Shampoo', quantity: 1, unitPrice: 8.2 }],
  },
];

export const PurchaseHistory = () => {
  const theme = useTheme();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const renderOrder = ({ item }: { item: Order }) => (
    <Card
      style={{ marginBottom: 12, backgroundColor: theme.colors.surfaceVariant }}
      onPress={() => setSelectedOrder(item)}
    >
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
            {item.date}
          </Text>
          <Chip icon="check" style={{ backgroundColor: theme.colors.primaryContainer }}>
            Paid
          </Chip>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="bodyMedium">Order #{item.id}</Text>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
            {item.total.toFixed(2)} €
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Text variant="bodySmall" style={{ opacity: 0.7 }}>
            {item.items.reduce((acc, i) => acc + i.quantity, 0)} items
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
            Tap for details
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <>
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50, opacity: 0.5 }}>
            No purchase history found.
          </Text>
        }
      />

      <OrderDetailsDialog
        visible={!!selectedOrder}
        order={selectedOrder}
        onDismiss={() => setSelectedOrder(null)}
      />
    </>
  );
};
