import React, { useEffect, useState } from 'react';
import { Surface, Text, Button } from 'react-native-paper';
import { useAuth } from '@/context/authContext';
import { userService } from '@/services/userService';
import LoadingContent from '@/components/ui/LoadingContent';
import ErrorContent from '@/components/ui/ErrorContent';
import { useRouter } from 'expo-router';

export default function UserScreen() {
  const { userId, token, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId || !token) {
      setError('User not authenticated');
      setUserData(null);
      return;
    }

    const loadData = async () => {
      try {
        const data = await userService.getUserProfile(userId, token);
        setUserData(data);
      } catch (error) {
        setError('Failed to load user profile');
        setUserData(null);
      }
    };
    loadData();
  }, [userId, token]);

  if (error) return (
    <Surface style={{ padding: 20 }}>
  <ErrorContent message={error} />
  <Button mode="contained" onPress={() => router.push('/login')} style={{ marginTop: 20 }}>
    Go to Login
  </Button>
  </Surface>);
  else if (!userData) return <LoadingContent />;

  return (
    <Surface style={{ padding: 20 }}>
      <Text>Bonjour {userData.firstName} !</Text>
      <Text>Email : {userData.email}</Text>
      <Text>ID : {userId}</Text>

      <Button mode="contained" onPress={logout}>
        Logout
      </Button>
    </Surface>
  );
}
