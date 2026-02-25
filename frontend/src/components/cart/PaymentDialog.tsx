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
  const [status, setStatus] = useState<
    'creating' | 'approving' | 'confirming' | 'capturing' | 'success' | 'error'
  >('creating');
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
      await WebBrowser.openBrowserAsync(approveLink);

      setStatus('confirming');
    } catch (error: any) {
      console.error('Payment error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.error || error.message || 'An error occurred');
    }
  };

  const handleConfirmPayment = async () => {
    if (!paypalOrderId) return;

    try {
      setStatus('capturing');
      await paymentService.captureOrder(paypalOrderId);
      setStatus('success');
    } catch (error: any) {
      console.error('Capture error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.error || error.message || 'Error processing payment');
    }
  };

  const handleCancelPayment = () => {
    setStatus('error');
    setErrorMessage('Payment cancelled');
  };

  const getTitle = () => {
    switch (status) {
      case 'creating':
        return 'Creating Order...';
      case 'approving':
        return 'Payment Approval';
      case 'confirming':
        return 'Payment Completed?';
      case 'capturing':
        return 'Processing Payment...';
      case 'success':
        return 'Payment Successful!';
      case 'error':
        return 'Payment Error';
      default:
        return 'Processing...';
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'creating':
        return 'Preparing your order...';
      case 'approving':
        return 'Please approve the payment in the PayPal browser';
      case 'confirming':
        return 'Did you approve the payment on PayPal?';
      case 'capturing':
        return 'Finalizing your order...';
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
      <Dialog
        visible={visible}
        onDismiss={status === 'error' ? onDismiss : undefined}
        dismissable={status === 'error' || status === 'confirming'}
      >
        <Dialog.Title style={{ textAlign: 'center' }}>{getTitle()}</Dialog.Title>
        <Dialog.Content>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            {isProcessing ? (
              <>
                <ActivityIndicator animating={true} size="large" />
                <Text style={{ marginTop: 20, textAlign: 'center' }}>{getMessage()}</Text>
              </>
            ) : status === 'confirming' ? (
              <>
                <Dialog.Icon icon="help-circle" size={50} color={theme.colors.primary} />
                <Text style={{ marginTop: 20, textAlign: 'center' }}>{getMessage()}</Text>
                <Text style={{ marginTop: 10, textAlign: 'center', opacity: 0.7 }}>
                  If you approved the payment on PayPal, click "Yes". Otherwise, click "No".
                </Text>
              </>
            ) : status === 'success' ? (
              <>
                <Dialog.Icon icon="check-circle" size={50} color={theme.colors.primary} />
                <Text style={{ marginTop: 20, textAlign: 'center' }}>{getMessage()}</Text>
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
        {(status === 'success' || status === 'error' || status === 'confirming') && (
          <Dialog.Actions
            style={status === 'confirming' ? { justifyContent: 'space-between' } : {}}
          >
            {status === 'confirming' ? (
              <>
                <Button onPress={handleCancelPayment}>No, Cancel</Button>
                <Button mode="contained" onPress={handleConfirmPayment}>
                  Yes, I Paid
                </Button>
              </>
            ) : status === 'success' ? (
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
