import React, { useEffect, useState } from 'react';
import { Surface, Text, Button } from 'react-native-paper';
import { useAuth } from '@/context/authContext';
import { userService } from '@/services/userService';

export default function UserScreen() {
  const { userId, token, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
        setError('Failed to load user data');
        setUserData(null);
      }
    };
    loadData();
  }, [userId, token]);

  if (error)
    return <Text>Error: {error}</Text>; // todo: error content
  else if (!userData) return <Text>Loading...</Text>; // todo: loading content

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
