import { Alert } from 'react-native';
import { supabase } from './supabase';

export const authService = {
  async register(email: string, pass: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });
    if (error) Alert.alert('Registration Error', error.message);
    return { data, error };
  },

  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) Alert.alert('Login Error', error.message);
    return { data, error };
  },

  async logout() {
    await supabase.auth.signOut();
  },
};
