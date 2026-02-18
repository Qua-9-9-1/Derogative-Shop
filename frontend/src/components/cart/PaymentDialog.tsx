import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

interface PaymentDialogProps {
  visible: boolean;
  onPaymentSuccess: () => void;
  onDismiss: () => void;
}

export const PaymentDialog = ({ visible, onPaymentSuccess, onDismiss }: PaymentDialogProps) => {
  const theme = useTheme();
  const [status, setStatus] = useState<'processing' | 'success'>('processing');

  useEffect(() => {
    if (visible) {
      setStatus('processing');
      const timer = setTimeout(() => {
        setStatus('success');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} dismissable={false}>
        <Dialog.Title style={{ textAlign: 'center' }}>
          {status === 'processing' ? 'Processing Payment...' : 'Payment Successful!'}
        </Dialog.Title>
        <Dialog.Content>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            {status === 'processing' ? (
              <>
                <ActivityIndicator animating={true} size="large" />
                <Text style={{ marginTop: 20 }}>Please wait while we contact the bank.</Text>
              </>
            ) : (
              <>
                <Dialog.Icon icon="check-circle" size={50} color={theme.colors.primary} />
                <Text style={{ marginTop: 20, textAlign: 'center' }}>
                  Thank you for your purchase. Your receipt has been sent by email.
                </Text>
              </>
            )}
          </View>
        </Dialog.Content>
        {status === 'success' && (
          <Dialog.Actions>
            <Button onPress={onPaymentSuccess}>Close</Button>
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
};
