import { useToastStore } from '@/store/toastStore';
import React from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

// Active les animations de layout sur Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ToastStack() {
  const { toasts, hideToast } = useToastStore();
  const theme = useTheme();

  // Animation fluide quand un toast apparaît/disparaît
  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <Surface key={toast.id} style={styles.toast} elevation={4}>
          <Text style={{ color: 'white', flex: 1, marginRight: 10 }} variant="bodyMedium">
            {toast.message}
          </Text>

          {toast.onAction && (
            <TouchableOpacity
              onPress={() => {
                toast.onAction?.();
                hideToast(toast.id);
              }}
            >
              <Text style={{ color: theme.colors.primaryContainer, fontWeight: 'bold' }}>
                {toast.actionLabel}
              </Text>
            </TouchableOpacity>
          )}
        </Surface>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    backgroundColor: '#353b58',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
