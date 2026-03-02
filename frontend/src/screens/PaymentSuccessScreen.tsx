import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Surface, Title, Paragraph } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function PaymentSuccessScreen() {
  const router = useRouter();

  return (
    <Surface style={styles.container}>
      <Title style={styles.title}>Paiement validé 🎉</Title>

      <Paragraph style={styles.text}>
        Merci pour votre commande ! Votre paiement a été confirmé avec succès.
      </Paragraph>

      <Button mode="contained" onPress={() => router.replace('/(tabs)')} style={styles.button}>
        Retour à l'accueil
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});
