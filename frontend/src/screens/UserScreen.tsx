import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Surface, Text, Button, Card, TextInput, Divider, IconButton } from 'react-native-paper';
import { useAuth } from '@/context/authContext';
import LoadingContent from '@/components/ui/LoadingContent';
import ErrorContent from '@/components/ui/ErrorContent';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/userContext';

interface EditableUserData {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export default function UserScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const { userData, loading, error: contextError, updateUser } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditableUserData>({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setEditData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        street: userData.billingAddress?.street || '',
        city: userData.billingAddress?.city || '',
        zipCode: userData.billingAddress?.zipCode || '',
        country: userData.billingAddress?.country || '',
      });
    }
  }, [userData]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateUser({
        firstName: editData.firstName || null,
        lastName: editData.lastName || null,
        phone: editData.phone || null,
        billingAddress: {
          street: editData.street || null,
          city: editData.city || null,
          zipCode: editData.zipCode || null,
          country: editData.country || null,
        },
      });
      setIsEditing(false);
    } catch (err) {
      setSaveError('Error saving changes');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setEditData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        street: userData.billingAddress?.street || '',
        city: userData.billingAddress?.city || '',
        zipCode: userData.billingAddress?.zipCode || '',
        country: userData.billingAddress?.country || '',
      });
    }
    setIsEditing(false);
    setSaveError(null);
  };

  if (contextError) {
    return (
      <Surface style={styles.container}>
        <ErrorContent message={contextError} />
        <Button mode="contained" onPress={() => router.push('/login')} style={{ marginTop: 20 }}>
          Go to Login
        </Button>
      </Surface>
    );
  }

  if (loading || !userData) {
    return <LoadingContent />;
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            My Profile
          </Text>
          {!isEditing && (
            <IconButton
              icon="pencil"
              mode="contained"
              onPress={() => setIsEditing(true)}
            />
          )}
        </View>

        {saveError && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>{saveError}</Text>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Title title="Personal Information" titleVariant="titleLarge" />
          <Card.Content>
            <View style={styles.field}>
              <Text variant="labelLarge">Email</Text>
              <Text variant="bodyLarge" style={styles.value}>
                {userData.email}
              </Text>
            </View>

            <Divider style={styles.divider} />

            {isEditing ? (
              <>
                <TextInput
                  label="First Name"
                  value={editData.firstName}
                  onChangeText={(text) => setEditData({ ...editData, firstName: text })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Last Name"
                  value={editData.lastName}
                  onChangeText={(text) => setEditData({ ...editData, lastName: text })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Phone"
                  value={editData.phone}
                  onChangeText={(text) => setEditData({ ...editData, phone: text })}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="phone-pad"
                />
              </>
            ) : (
              <>
                <View style={styles.field}>
                  <Text variant="labelLarge">First Name</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {userData.firstName || 'Not provided'}
                  </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.field}>
                  <Text variant="labelLarge">Last Name</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {userData.lastName || 'Not provided'}
                  </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.field}>
                  <Text variant="labelLarge">Phone</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {userData.phone || 'Not provided'}
                  </Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Billing Address" titleVariant="titleLarge" />
          <Card.Content>
            {isEditing ? (
              <>
                <TextInput
                  label="Street"
                  value={editData.street}
                  onChangeText={(text) => setEditData({ ...editData, street: text })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="City"
                  value={editData.city}
                  onChangeText={(text) => setEditData({ ...editData, city: text })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Zip Code"
                  value={editData.zipCode}
                  onChangeText={(text) => setEditData({ ...editData, zipCode: text })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Country"
                  value={editData.country}
                  onChangeText={(text) => setEditData({ ...editData, country: text })}
                  style={styles.input}
                  mode="outlined"
                />
              </>
            ) : (
              <>
                <View style={styles.field}>
                  <Text variant="labelLarge">Street</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {userData.billingAddress?.street || 'Not provided'}
                  </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.field}>
                  <Text variant="labelLarge">City</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {userData.billingAddress?.city || 'Not provided'}
                  </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.field}>
                  <Text variant="labelLarge">Zip Code</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {userData.billingAddress?.zipCode || 'Not provided'}
                  </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.field}>
                  <Text variant="labelLarge">Country</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {userData.billingAddress?.country || 'Not provided'}
                  </Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {isEditing ? (
          <View style={styles.editButtons}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.cancelButton}
              disabled={saving}
            >
              Discard
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              loading={saving}
              disabled={saving}
            >
              Save
            </Button>
          </View>
        ) : (
          <Button
            mode="contained-tonal"
            onPress={logout}
            style={styles.logoutButton}
            icon="logout"
          >
            Logout
          </Button>
        )}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surface: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  field: {
    marginVertical: 8,
  },
  value: {
    marginTop: 4,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 8,
  },
  input: {
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  logoutButton: {
    marginTop: 8,
  },
  errorCard: {
    marginBottom: 16,
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
  },
});
