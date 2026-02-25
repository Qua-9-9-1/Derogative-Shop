import React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Avatar, useTheme, IconButton, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useUser } from '@/context/userContext';
import { useCartStore } from '@/store/cartStore';

const FEATURED = [
  {
    id: '1',
    name: 'Avocats Bio',
    price: 5.99,
    img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400',
  },
  {
    id: '2',
    name: 'Pain Artisan',
    price: 4.5,
    img: 'https://images.unsplash.com/photo-1585478259539-9b96c6a7f529?w=400',
  },
  {
    id: '3',
    name: 'Oeufs',
    price: 3.25,
    img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400',
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { userData: user } = useUser();
  const { items, totalPrice } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

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
            Featured Products
          </Text>
          <Button compact onPress={() => navigation.navigate('products')}>
            See products
          </Button>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {FEATURED.map((p) => (
            <Card key={p.id} style={styles.card} onPress={() => console.log('Produit', p.name)}>
              <View style={styles.cardImageContainer}>
                <Image source={{ uri: p.img }} style={styles.cardImage} contentFit="cover" />
              </View>
              <Card.Content style={styles.cardContent}>
                <Text variant="bodyMedium" numberOfLines={1} style={styles.productName}>
                  {p.name}
                </Text>
                <Text variant="bodySmall" style={dynamicStyles.priceColor}>
                  {p.price.toFixed(2)} €
                </Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
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
