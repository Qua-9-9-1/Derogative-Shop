import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Surface, Text, useTheme, SegmentedButtons } from 'react-native-paper';
import { useCartStore } from '@/store/cartStore';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { StockValidationDialog } from '@/components/cart/StockValidationDialog';
import { PaymentDialog } from '@/components/cart/PaymentDialog';
import { PurchaseHistory } from '@/components/cart/PurchaseHistory';

export default function CartScreen() {
  const theme = useTheme();
  const { items, addItem, updateQuantity, clearCart, totalPrice } = useCartStore();

  const [viewMode, setViewMode] = useState<string>('cart');
  const [stockDialogVisible, setStockDialogVisible] = useState(false);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);
  const [missingItems, setMissingItems] = useState<any[]>([]);

  const mockCheckStock = (cartItems: any[]) => cartItems.filter((_, index) => index % 3 === 0);

  const handleInitiatePayment = () => {
    if (items.length === 0) return;
    const outOfStock = mockCheckStock(items);
    if (outOfStock.length > 0) {
      setMissingItems(outOfStock);
      setStockDialogVisible(true);
    } else {
      setPaymentDialogVisible(true);
    }
  };

  const handleForcePay = () => {
    setStockDialogVisible(false);
    setTimeout(() => setPaymentDialogVisible(true), 200);
  };

  const handlePaymentSuccess = () => {
    setPaymentDialogVisible(false);
    clearCart();
  };

  return (
    <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={setViewMode}
          buttons={[
            {
              value: 'cart',
              label: 'My Cart',
              icon: 'cart',
            },
            {
              value: 'history',
              label: 'History',
              icon: 'history',
            },
          ]}
        />
      </View>

      {viewMode === 'cart' ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                onIncrement={() => addItem(item)}
                onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
              />
            )}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 50, opacity: 0.5 }}>
                Your cart is empty.
              </Text>
            }
          />

          {items.length > 0 && (
            <CartSummary total={totalPrice()} onPay={handleInitiatePayment} onClear={clearCart} />
          )}
        </>
      ) : (
        <PurchaseHistory />
      )}

      <StockValidationDialog
        visible={stockDialogVisible}
        missingItems={missingItems}
        onDismiss={() => setStockDialogVisible(false)}
        onForcePay={handleForcePay}
      />

      <PaymentDialog
        visible={paymentDialogVisible}
        onPaymentSuccess={handlePaymentSuccess}
        onDismiss={() => setPaymentDialogVisible(false)}
      />
    </Surface>
  );
}
