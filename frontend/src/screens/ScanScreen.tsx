import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Vibration } from 'react-native';
import { ActivityIndicator, Button, Card, Modal, Paragraph, Text, Title, Dialog, Portal, Surface } from 'react-native-paper';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<String | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notFoundDialogVisible, setNotFoundDialogVisible] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [addedDialogVisible, setAddedDialogVisible] = useState(false);

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

    const foundProduct = true; // todo api call to openfoodfacts

    setLoading(false);

    if (foundProduct) {
      setProduct('Test Product');
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
        <Surface style={styles.scanFrame} />
        <Text style={styles.helpText}>Aim at a barcode</Text>
      </Surface>

      {loading && (
        <Surface style={styles.loadingOverlay}>
          <ActivityIndicator animating={true} size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Searching for product...</Text>
        </Surface>
      )}

      <Modal
        visible={modalVisible}
        onDismiss={closeModal}
        contentContainerStyle={styles.modalContent}
      >
        {product && (
          <Card>
            <Card.Cover source={{ uri: 'https://via.placeholder.com/150' }} />
            <Card.Content>
              <Title>{product}</Title>
              <Paragraph>Brand: {'test brand'}</Paragraph>
              <Paragraph style={styles.price}>{'unknown'} €</Paragraph>
              <Paragraph>Nutriscore: {'OPFER'}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={closeModal}>Cancel</Button>
              <Button
                mode="contained"
                onPress={() => {
                  setAddedDialogVisible(true);
                  closeModal();
                }}
              >
                Add to cart
              </Button>
            </Card.Actions>
          </Card>
        )}
      </Modal>

      <Portal>
        <Dialog visible={notFoundDialogVisible} onDismiss={() => {
          setNotFoundDialogVisible(false);
          setScanned(false);
        }}>
          <Dialog.Title>Product not found</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Code: {scannedCode}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setNotFoundDialogVisible(false);
              setScanned(false);
            }}>OK</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={addedDialogVisible} onDismiss={() => setAddedDialogVisible(false)}>
          <Dialog.Title>Added!</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Cart functionality coming soon...</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddedDialogVisible(false)}>OK</Button>
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
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  helpText: {
    color: 'white',
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { margin: 20, backgroundColor: 'white', borderRadius: 10 },
  price: { fontSize: 20, fontWeight: 'bold', color: 'green', marginVertical: 5 },
});
