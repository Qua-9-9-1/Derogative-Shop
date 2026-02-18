import { authService } from '@/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button, HelperText, TextInput, Title, Dialog, Portal, Paragraph, Surface } from 'react-native-paper';
import { z } from 'zod';

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string().min(6, { message: '6 caractères minimum' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const showDialog = (title: string, message: string, success: boolean = false) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setIsSuccess(success);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    if (isSuccess) {
      router.back();
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setLoading(true);
    const { error } = await authService.register(data.email, data.password);
    setLoading(false);

    if (error) {
      showDialog('Error', error.message);
    } else {
      showDialog('Success', 'Account created! Please log in.', true);
    }
  };

  return (
    <Surface style={styles.container}>
      <Title style={styles.title}>Create an account</Title>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Email"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email?.message}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.password}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password?.message}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Confirm Password"
              mode="outlined"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.confirmPassword}
            />
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword?.message}
            </HelperText>
          </>
        )}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onRegister)}
        loading={loading}
        style={styles.button}
      >
        {'Register'}
      </Button>

      <Button mode="text" onPress={() => router.back()} style={{ marginTop: 10 }}>
        {'Cancel'}
      </Button>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{dialogMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 20, fontSize: 24, fontWeight: 'bold' },
  button: { marginTop: 10, paddingVertical: 5 },
});
