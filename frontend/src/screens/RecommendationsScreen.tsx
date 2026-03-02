import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Surface, Text, Card, useTheme } from 'react-native-paper';
import { Image } from 'expo-image';
import { recommendationService } from '@/services/recommendationService';

export default function RecommendationsScreen() {
  const theme = useTheme();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await recommendationService.getRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.log('Error fetching recommendations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const dynamicStyles = {
    priceColor: { color: theme.colors.primary },
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={1}>
        <Text variant="headlineSmall" style={styles.title}>
          Recommandé pour vous
        </Text>
      </Surface>

      {loading ? (
        <View style={styles.section}>
          <Text>Chargement...</Text>
        </View>
      ) : recommendations.length === 0 ? (
        <View style={styles.section}>
          <Text>Aucune recommandation disponible.</Text>
        </View>
      ) : (
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {recommendations.map((item) => (
              <Card key={item.id} style={styles.card}>
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: item.smallImageUrl || item.imageUrl }}
                    style={styles.cardImage}
                    contentFit="cover"
                  />
                </View>
                <Card.Content style={styles.cardContent}>
                  <Text numberOfLines={1} style={styles.productName}>
                    {item.name}
                  </Text>
                  <Text style={dynamicStyles.priceColor}>{Number(item.price).toFixed(2)} €</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
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
