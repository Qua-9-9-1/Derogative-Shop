import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import { paymentService } from '@/services/paymentService';

interface PaymentDialogProps {
  visible: boolean;
  onPaymentSuccess: () => void;
  onDismiss: () => void;
}

export const PaymentDialog = ({ visible, onPaymentSuccess, onDismiss }: PaymentDialogProps) => {
  const theme = useTheme();
  const [status, setStatus] = useState<'creating' | 'approving' | 'capturing' | 'success' | 'error'>('creating');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      handlePayment();
    } else {
      setStatus('creating');
      setErrorMessage('');
      setPaypalOrderId(null);
    }
  }, [visible]);

  const handlePayment = async () => {
    try {
      setStatus('creating');
      const { paypalOrderId: orderId, approveLink } = await paymentService.createOrder();
      setPaypalOrderId(orderId);

      setStatus('approving');
      const result = await WebBrowser.openBrowserAsync(approveLink);

      if (result.type === 'cancel') {
        setStatus('error');
        setErrorMessage('Payment cancelled');
        return;
      }

      setStatus('capturing');
      await paymentService.captureOrder(orderId);

      setStatus('success');
    } catch (error: any) {
      console.error('Payment error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.error || error.message || 'An error occurred');
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'creating':
        return 'Creating order...';
      case 'approving':
        return 'Awaiting payment approval';
      case 'capturing':
        return 'Validating payment...';
      case 'success':
        return 'Payment successful!';
      case 'error':
        return 'Payment error';
      default:
        return 'Processing...';
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'creating':
        return 'Creating your order...';
      case 'approving':
        return 'Please approve the payment in the PayPal browser window.';
      case 'capturing':
        return 'Finalising your order...';
      case 'success':
        return 'Thank you for your purchase! Your order has been confirmed.';
      case 'error':
        return errorMessage;
      default:
        return '';
    }
  };

  const isProcessing = ['creating', 'approving', 'capturing'].includes(status);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={status === 'error' ? onDismiss : undefined} dismissable={status === 'error'}>
        <Dialog.Title style={{ textAlign: 'center' }}>
          {getTitle()}
        </Dialog.Title>
        <Dialog.Content>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            {isProcessing ? (
              <>
                <ActivityIndicator animating={true} size="large" />
                <Text style={{ marginTop: 20, textAlign: 'center' }}>{getMessage()}</Text>
              </>
            ) : status === 'success' ? (
              <>
                <Dialog.Icon icon="check-circle" size={50} color={theme.colors.primary} />
                <Text style={{ marginTop: 20, textAlign: 'center' }}>
                  {getMessage()}
                </Text>
              </>
            ) : (
              <>
                <Dialog.Icon icon="alert-circle" size={50} color={theme.colors.error} />
                <Text style={{ marginTop: 20, textAlign: 'center', color: theme.colors.error }}>
                  {getMessage()}
                </Text>
              </>
            )}
          </View>
        </Dialog.Content>
        {(status === 'success' || status === 'error') && (
          <Dialog.Actions>
            {status === 'success' ? (
              <Button onPress={onPaymentSuccess}>Close</Button>
            ) : (
              <Button onPress={onDismiss}>Close</Button>
            )}
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
};
