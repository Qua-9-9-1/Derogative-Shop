import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Card, Text, Button, Surface } from 'react-native-paper';
import { Product } from '@/services/productService';
import { useCartStore } from '@/store/cartStore';

interface ProductModalProps {
  visible: boolean;
  product: Product | null;
  onDismiss: () => void;
  onAddToCart?: () => void;
}

export default function ProductModal({
  visible,
  product,
  onDismiss,
  onAddToCart,
}: ProductModalProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      onAddToCart?.();
      onDismiss();
    }
  };

  if (!product) return null;

  return (
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContent}>
      <Card>
        <Card.Cover
          source={{
            uri: product.image_url || product.small_image_url || 'https://via.placeholder.com/400',
          }}
        />
        <Card.Content>
          <Surface style={styles.header}>
            <View style={styles.headerLeft}>
              <Text variant="titleLarge" style={styles.productName}>
                {product.name}
              </Text>
              {product.brands && (
                <Text variant="bodyMedium" style={styles.brandText}>
                  {product.brands}
                </Text>
              )}
            </View>
            <Button icon="close" onPress={onDismiss} compact>
              {' '}
            </Button>
          </Surface>

          <View style={styles.infoSection}>
            <Text variant="bodyLarge" style={styles.price}>
              {product.price || 0} €
            </Text>
            {product.nutriscore && (
              <Text variant="bodyMedium" style={styles.nutriscore}>
                Nutriscore: {product.nutriscore.toUpperCase()}
              </Text>
            )}
            {product.quantity !== undefined && (
              <Text variant="bodyMedium" style={styles.stock}>
                In stock: {product.quantity}
              </Text>
            )}
          </View>

          {product.nutritional_info && Object.keys(product.nutritional_info).length > 0 && (
            <View style={styles.nutritionSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Nutritional information (per 100g)
              </Text>
              {Object.entries(product.nutritional_info)
                .slice(0, 8)
                .map(
                  ([key, value]) =>
                    value && (
                      <Text key={key} variant="bodySmall" style={styles.nutritionItem}>
                        • {key.replace(/_/g, ' ')}: {value}
                      </Text>
                    )
                )}
            </View>
          )}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button mode="contained" onPress={handleAddToCart}>
            Add to cart
          </Button>
        </Card.Actions>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 20,
    marginVertical: 'auto',
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '80%',
    alignSelf: 'center',
    width: '90%',
    maxWidth: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
  },
  brandText: {
    opacity: 0.6,
    marginTop: 4,
  },
  infoSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 8,
  },
  nutriscore: {
    marginBottom: 4,
  },
  stock: {
    opacity: 0.7,
  },
  nutritionSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nutritionItem: {
    marginVertical: 2,
    textTransform: 'capitalize',
  },
  actions: {
    justifyContent: 'flex-end',
  },
});
