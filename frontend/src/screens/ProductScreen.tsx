import { Product, productService } from '@/services/productService';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import React, { useEffect, useState } from 'react';
import { FlatList, View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import {
  Card,
  IconButton,
  Searchbar,
  Surface,
  Text,
  useTheme,
  Portal,
  Modal,
  Button,
  List,
} from 'react-native-paper';
import LoadingContent from '@/components/ui/LoadingContent';

export default function ProductScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nutritionalExpanded, setNutritionalExpanded] = useState(false);

  const theme = useTheme();
  const { showToast } = useToastStore();
  const { addItem, updateQuantity } = useCartStore();

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.searchProducts('');
    setAllProducts(data);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setProducts(allProducts);
    } else {
      const lower = searchQuery.toLowerCase();
      setProducts(
        allProducts.filter(
          (item) =>
            item.name.toLowerCase().includes(lower) ||
            (item.brands && item.brands.toLowerCase().includes(lower))
        )
      );
    }
  }, [searchQuery, allProducts]);

  const handleAddToCart = (item: Product) => {
    addItem(item);
    showToast(`Item "${item.name}" added to cart`, () => {
      updateQuantity(item.id, item.quantity - 1);
    });
  };

  const openProductDetails = (item: Product) => {
    setSelectedProduct(item);
    setModalVisible(true);
    setNutritionalExpanded(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable onPress={() => openProductDetails(item)}>
      <Card style={{ marginBottom: 12, backgroundColor: theme.colors.elevation.level1 }}>
        <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text variant="titleMedium" numberOfLines={2} style={{ fontWeight: 'bold' }}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.secondary, marginBottom: 8 }}>
              {item.brands}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 4,
              }}
            >
              <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '900' }}>
                {item.price} €
              </Text>

              <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                Quantity: {item.quantity}
              </Text>

              <IconButton
                icon="plus"
                mode="contained"
                containerColor={theme.colors.primaryContainer}
                iconColor={theme.colors.primary}
                size={20}
                onPress={() => handleAddToCart(item)}
              />
            </View>
          </View>
          <Image
            source={{
              uri: item.small_image_url || item.image_url || 'https://via.placeholder.com/150',
            }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              backgroundColor: 'white',
              resizeMode: 'contain',
            }}
            contentFit="cover"
            transition={500}
            cachePolicy="disk"
          />
        </Card.Content>
      </Card>
    </Pressable>
  );

  return (
    <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Searchbar
        placeholder="Search products"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ margin: 16 }}
      />

      {loading ? (
        <LoadingContent />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContent}
        >
          {selectedProduct && (
            <ScrollView>
              <Card>
                <Card.Content style={{ alignItems: 'flex-end' }}>
                  <IconButton icon="close" size={24} onPress={closeModal} />
                </Card.Content>

                <Image
                  source={{
                    uri: selectedProduct.image_url || 'https://via.placeholder.com/300',
                  }}
                  style={styles.modalImage}
                  contentFit="contain"
                  transition={500}
                />

                <Card.Content>
                  <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    {selectedProduct.name}
                  </Text>

                  {selectedProduct.brands && (
                    <Text
                      variant="bodyLarge"
                      style={{ color: theme.colors.secondary, marginBottom: 12 }}
                    >
                      {selectedProduct.brands}
                    </Text>
                  )}

                  <View style={styles.infoRow}>
                    <Text
                      variant="titleLarge"
                      style={{ color: theme.colors.primary, fontWeight: 'bold' }}
                    >
                      {selectedProduct.price} €
                    </Text>
                    {selectedProduct.nutriscore && (
                      <Surface
                        style={[
                          styles.nutriscoreBadge,
                          { backgroundColor: theme.colors.primaryContainer },
                        ]}
                      >
                        <Text style={{ fontWeight: 'bold' }}>
                          Nutriscore: {selectedProduct.nutriscore.toUpperCase()}
                        </Text>
                      </Surface>
                    )}
                  </View>

                  <Text
                    variant="bodyMedium"
                    style={{ marginTop: 8, color: theme.colors.secondary }}
                  >
                    Stock disponible: {selectedProduct.quantity}
                  </Text>

                  {/* Nutritional Information Section */}
                  {selectedProduct.nutritional_info &&
                    Object.keys(selectedProduct.nutritional_info).length > 0 && (
                      <List.Accordion
                        title="Informations nutritionnelles"
                        expanded={nutritionalExpanded}
                        onPress={() => setNutritionalExpanded(!nutritionalExpanded)}
                        style={{
                          marginTop: 16,
                          backgroundColor: theme.colors.elevation.level2,
                          borderRadius: 8,
                        }}
                        titleStyle={{ fontWeight: 'bold' }}
                      >
                        {Object.entries(selectedProduct.nutritional_info).map(
                          ([key, value]) =>
                            value && (
                              <List.Item
                                key={key}
                                title={key
                                  .replace(/_/g, ' ')
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                                description={value}
                                left={(props) => <List.Icon {...props} icon="nutrition" />}
                                style={{ paddingLeft: 16 }}
                              />
                            )
                        )}
                      </List.Accordion>
                    )}
                </Card.Content>

                <Card.Actions
                  style={{
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                  }}
                >
                  <Button mode="outlined" onPress={closeModal}>
                    Fermer
                  </Button>
                  <Button
                    mode="contained"
                    icon="plus"
                    onPress={() => {
                      handleAddToCart(selectedProduct);
                      closeModal();
                    }}
                  >
                    Ajouter au panier
                  </Button>
                </Card.Actions>
              </Card>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </Surface>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '90%',
  },
  modalImage: {
    width: '100%',
    height: 250,
    backgroundColor: 'white',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  nutriscoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
