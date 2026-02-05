import { ToastMessage, useToastStore } from '@/store/toastStore';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

const AnimatedToast = ({ toast, onHide }: { toast: ToastMessage; onHide: () => void }) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const hideTimeout = useRef<number | null>(null);
  const isHiding = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();

    hideTimeout.current = setTimeout(() => {
      hideWithAnimation();
    }, 4700);

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const hideWithAnimation = () => {
    if (isHiding.current) return;
    isHiding.current = true;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      onHide();
    });
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Surface style={styles.toast} elevation={4}>
        <Text style={{ color: 'white', flex: 1, marginRight: 10 }} variant="bodyMedium">
          {toast.message}
        </Text>
        {toast.onAction && (
          <TouchableOpacity
            onPress={() => {
              toast.onAction?.();
              if (hideTimeout.current) clearTimeout(hideTimeout.current);
              hideWithAnimation();
            }}
          >
            <Text style={{ color: theme.colors.primaryContainer, fontWeight: 'bold' }}>
              {toast.actionLabel}
            </Text>
          </TouchableOpacity>
        )}
      </Surface>
    </Animated.View>
  );
};

export default function ToastStack() {
  const { toasts, hideToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <AnimatedToast key={toast.id} toast={toast} onHide={() => hideToast(toast.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
