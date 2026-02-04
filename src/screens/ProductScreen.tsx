import React, { useEffect, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import {
  ActivityIndicator,
  Card,
  IconButton,
  Searchbar,
  Snackbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { Product, productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('Snack');
  const [loading, setLoading] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<Product | null>(null);

  const theme = useTheme();

  const { addToCart, decreaseQuantity } = useCartStore();

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.searchProducts(searchQuery);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (item: Product) => {
    addToCart(item);
    setLastAddedItem(item);
    setSnackbarVisible(true);
  };

  const handleUndo = () => {
    if (lastAddedItem) {
      decreaseQuantity(lastAddedItem.id);
      setSnackbarVisible(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
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
          source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            backgroundColor: 'white',
            resizeMode: 'contain',
          }}
        />
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Searchbar
        placeholder="Search products"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={loadProducts}
        style={{ margin: 16 }}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={8000}
        action={{
          label: 'Undo',
          onPress: handleUndo,
          textColor: theme.colors.inversePrimary,
        }}
        style={{ marginBottom: 20 }}
      >
        Product added to cart!
      </Snackbar>
    </Surface>
  );
}
