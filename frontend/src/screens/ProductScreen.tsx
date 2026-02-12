import { Product, productService } from '@/services/productService';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Card,
  IconButton,
  Searchbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import LoadingContent from '@/components/ui/LoadingContent';

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const { showToast } = useToastStore();
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
    showToast(`Item "${item.name}" added to cart`, () => {
      decreaseQuantity(item.id);
    });
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
          source={{ uri: item.small_image_url || item.image_url || 'https://via.placeholder.com/150' }}
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
    </Surface>
  );
}
