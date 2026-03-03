import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Surface,
  Text,
  Button,
  Card,
  TextInput,
  Divider,
  IconButton,
  Portal,
  Modal,
} from 'react-native-paper';
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
  const { userData, loading, error: contextError, updateUser, updatePassword } = useUser();

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

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old: '',
    new: '',
    confirm: '',
  });

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

  const handleSaveUser = async () => {
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

  const handleSavePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setSaveError('New password and confirmation do not match');
      return;
    }

    try {
      await updatePassword?.(passwordData.old, passwordData.new);
      setShowPasswordModal(false);
      setPasswordData({ old: '', new: '', confirm: '' });
    } catch (err) {
      setSaveError('Error updating password');
      console.error(err);
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
        <Button mode="contained" onPress={logout} style={{ marginTop: 20 }}>
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
            <IconButton icon="pencil" mode="contained" onPress={() => setIsEditing(true)} />
          )}
        </View>

        {!isEditing && (
          <Button
            mode="outlined"
            icon="lock"
            style={styles.passwordButton}
            onPress={() => setShowPasswordModal(true)}
          >
            Edit Password
          </Button>
        )}

        <Portal>
          <Modal
            visible={showPasswordModal}
            onDismiss={() => {
              setShowPasswordModal(false);
              setPasswordData({ old: '', new: '', confirm: '' });
            }}
            contentContainerStyle={styles.passwordModal}
          >
            <Text variant="titleLarge" style={{ marginBottom: 12 }}>
              Edit Password
            </Text>
            <TextInput
              label="Old Password"
              value={passwordData.old}
              onChangeText={(text) => setPasswordData({ ...passwordData, old: text })}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              autoComplete="current-password"
            />
            <TextInput
              label="New Password"
              value={passwordData.new}
              onChangeText={(text) => setPasswordData({ ...passwordData, new: text })}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              autoComplete="new-password"
            />
            <TextInput
              label="Confirm New Password"
              value={passwordData.confirm}
              onChangeText={(text) => setPasswordData({ ...passwordData, confirm: text })}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              autoComplete="new-password"
            />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ old: '', new: '', confirm: '' });
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                style={{ flex: 1 }}
                onPress={() => {
                  handleSavePassword();
                }}
              >
                Save
              </Button>
            </View>
          </Modal>
        </Portal>

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
              onPress={handleSaveUser}
              style={styles.saveButton}
              loading={saving}
              disabled={saving}
            >
              Save
            </Button>
          </View>
        ) : (
          <Button mode="contained-tonal" onPress={logout} style={styles.logoutButton} icon="logout">
            Logout
          </Button>
        )}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  passwordButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  passwordModal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 24,
    borderRadius: 12,
    elevation: 4,
  },
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
