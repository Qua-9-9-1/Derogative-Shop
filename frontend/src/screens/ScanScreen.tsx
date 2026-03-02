import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Vibration, Dimensions } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Paragraph,
  Text,
  Dialog,
  Portal,
  Surface,
} from 'react-native-paper';
import { productService } from '@/services/productService';
import { Product } from '@/services/productService';
import ProductModal from '@/components/ProductModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCAN_FRAME_WIDTH = SCREEN_WIDTH * 0.85;
const SCAN_FRAME_HEIGHT = SCREEN_HEIGHT * 0.35;

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notFoundDialogVisible, setNotFoundDialogVisible] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Vibration.vibrate();
    setLoading(true);

    const foundProduct = await productService.getProductByBarcode(data);
    setLoading(false);

    if (foundProduct) {
      setProduct(foundProduct);
      setModalVisible(true);
    } else {
      setScannedCode(data);
      setNotFoundDialogVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setProduct(null);
    setScanned(false);
  };

  if (hasPermission === null)
    return (
      <Surface style={styles.center}>
        <Text>Asking for permission...</Text>
      </Surface>
    );
  if (hasPermission === false)
    return (
      <Surface style={styles.center}>
        <Text>No access to camera...</Text>
      </Surface>
    );

  return (
    <Surface style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'qr'],
        }}
      />

      <Surface style={styles.overlay}>
        <Surface style={styles.scanFrame}>
          <Text style={styles.helpText}>Aim at a barcode</Text>
        </Surface>
      </Surface>

      {loading && (
        <Surface style={styles.loadingOverlay}>
          <ActivityIndicator animating={true} size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Searching for product...</Text>
        </Surface>
      )}

      <ProductModal visible={modalVisible} product={product} onDismiss={closeModal} />

      <Portal>
        <Dialog
          visible={notFoundDialogVisible}
          onDismiss={() => {
            setNotFoundDialogVisible(false);
            setScanned(false);
          }}
        >
          <Dialog.Title>Product not found</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Code: {scannedCode}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setNotFoundDialogVisible(false);
                setScanned(false);
              }}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: SCAN_FRAME_WIDTH,
    height: SCAN_FRAME_HEIGHT,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
