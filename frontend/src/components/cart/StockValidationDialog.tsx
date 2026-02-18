import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Dialog, Portal, Text, List, useTheme } from 'react-native-paper';
import { CartItem } from '@/store/cartStore';

interface StockValidationDialogProps {
  visible: boolean;
  missingItems: CartItem[];
  onDismiss: () => void;
  onForcePay: () => void;
}

export const StockValidationDialog = ({
  visible,
  missingItems,
  onDismiss,
  onForcePay,
}: StockValidationDialogProps) => {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Icon icon="alert" color={theme.colors.error} />
        <Dialog.Title style={{ textAlign: 'center' }}>Stock Alert</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
            Some items are currently out of stock or have insufficient quantity:
          </Text>
          <ScrollView style={{ maxHeight: 150 }}>
            {missingItems.map((item) => (
              <List.Item
                key={item.id}
                title={item.name}
                description={`Requested: ${item.quantity}`}
                left={(props) => (
                  <List.Icon {...props} icon="close-circle" color={theme.colors.error} />
                )}
              />
            ))}
          </ScrollView>
          <Text variant="bodyMedium" style={{ marginTop: 10 }}>
            Do you want to proceed with payment anyway?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={onForcePay} mode="contained" buttonColor={theme.colors.error}>
            Pay Anyway
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
