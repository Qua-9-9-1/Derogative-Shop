import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Chip, Text, useTheme } from 'react-native-paper';
import { Order, OrderDetailsDialog } from './OrderDetailsDialog';
import { paymentService } from '@/services/paymentService';
import LoadingContent from '../ui/LoadingContent';
import ErrorContent from '../ui/ErrorContent';

export const PurchaseHistory = () => {
  const theme = useTheme();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getOrderHistory();
      
      const transformedOrders: Order[] = data.map((order: any) => ({
        id: order.id,
        date: new Date(order.createdAt).toLocaleDateString('fr-FR'),
        total: order.total,
        status: order.status === 'COMPLETED' ? 'paid' : 'pending',
        items: order.items.map((item: any) => ({
          id: item.id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      }));
      
      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error loading order history:', err);
      setError('Failed to load purchase history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContent />;
  }

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <ErrorContent message={error} />
      </View>
    );
  }

  const renderOrder = ({ item }: { item: Order }) => {
    const isPaid = item.status === 'paid';
    
    return (
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
            <Chip
              icon={isPaid ? 'check' : 'clock-outline'}
              style={{
                backgroundColor: isPaid
                  ? theme.colors.primaryContainer
                  : theme.colors.secondaryContainer,
              }}
            >
              {isPaid ? 'Paid' : 'Pending'}
            </Chip>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="bodyMedium">Order #{item.id.substring(0, 8)}</Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              {item.total.toFixed(2)} €
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text variant="bodySmall" style={{ opacity: 0.7 }}>
              {item.items.reduce((acc, i) => acc + i.quantity, 0)} article{item.items.reduce((acc, i) => acc + i.quantity, 0) > 1 ? 's' : ''}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
              See details
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50, opacity: 0.5 }}>
            No orders found. Start shopping to see your purchase history here!
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
