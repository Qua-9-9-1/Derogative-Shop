import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button, Card, Avatar, useTheme, IconButton, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useUser } from '@/context/userContext';
import { useCartStore } from '@/store/cartStore';
import { recommendationService } from '@/services/recommendationService';
import { Product } from '@/services/productService';

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { userData: user } = useUser();
  const { items, totalPrice } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getRecommendations();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = {
    avatarBg: { backgroundColor: theme.colors.primary },
    headerBg: { backgroundColor: theme.colors.primaryContainer },
    priceColor: { color: theme.colors.primary },
    cartBg: { backgroundColor: theme.colors.tertiaryContainer },
    cartTitleStyle: { fontWeight: 'bold' as const, color: theme.colors.onTertiaryContainer },
    cartSubtitleStyle: { color: theme.colors.onTertiaryContainer },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Surface style={[styles.header, dynamicStyles.headerBg]} elevation={1}>
        <View>
          <Text variant="labelLarge" style={styles.welcomeLabel}>
            Welcome back,
          </Text>
          <Text variant="headlineSmall" style={styles.userName}>
            {user?.firstName || 'User'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('user')}>
          <Avatar.Icon size={48} icon="account" style={dynamicStyles.avatarBg} />
        </TouchableOpacity>
      </Surface>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Fast access
        </Text>
        <View style={styles.row}>
          <Button
            mode="contained"
            icon="barcode-scan"
            onPress={() => navigation.navigate('scan')}
            style={styles.btnLeft}
            contentStyle={styles.btnContent}
          >
            Scanner
          </Button>
          <Button
            mode="contained-tonal"
            icon="cart"
            onPress={() => navigation.navigate('cart')}
            style={styles.btnRight}
            contentStyle={styles.btnContent}
          >
            Cart ({itemCount})
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recommended for you
          </Text>
          <Button compact onPress={() => navigation.navigate('products')}>
            See products
          </Button>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {products.map((p) => (
              <Card key={p.id} style={styles.card} onPress={() => console.log('Produit', p.name)}>
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: p.small_image_url || p.image_url || 'https://via.placeholder.com/140' }}
                    style={styles.cardImage}
                    contentFit="cover"
                  />
                </View>
                <Card.Content style={styles.cardContent}>
                  <Text variant="bodyMedium" numberOfLines={1} style={styles.productName}>
                    {p.name}
                  </Text>
                  {p.brands && (
                    <Text variant="bodySmall" numberOfLines={1} style={styles.brandText}>
                      {p.brands}
                    </Text>
                  )}
                  <Text variant="bodySmall" style={dynamicStyles.priceColor}>
                    {p.price ? `${p.price} €` : 'N/A'}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        )}
      </View>

      {itemCount > 0 && (
        <View style={styles.section}>
          <Card mode="elevated" style={dynamicStyles.cartBg}>
            <Card.Title
              title="Cart in progress"
              subtitle={`${itemCount} items • Total: ${totalPrice().toFixed(2)} €`}
              titleStyle={dynamicStyles.cartTitleStyle}
              subtitleStyle={dynamicStyles.cartSubtitleStyle}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="arrow-right"
                  iconColor={theme.colors.onTertiaryContainer}
                  onPress={() => navigation.navigate('cart')}
                />
              )}
            />
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  welcomeLabel: {
    opacity: 0.7,
  },
  userName: {
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  btnLeft: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
    justifyContent: 'center',
  },
  btnRight: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    justifyContent: 'center',
  },
  btnContent: {
    height: 60,
  },
  horizontalScrollContent: {
    paddingRight: 16,
  },
  card: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
  },
  brandText: {
    opacity: 0.6,
    marginTop: 2,
  },
  loadingContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageContainer: {
    height: 100,
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardImage: {
    flex: 1,
  },
  cardContent: {
    padding: 10,
  },
  productName: {
    fontWeight: 'bold',
  },
});
