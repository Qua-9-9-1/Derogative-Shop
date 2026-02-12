import { create } from 'zustand';
import { Product } from '../services/productService';
import { cartService } from '../services/cartService';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isDirty: boolean;
  isLoading: boolean;

  addItem: (product: Product) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  totalPrice: () => number;

  syncWithBackend: () => Promise<void>;
  initializeCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isDirty: false,
  isLoading: false,

  addItem: (product) => {
    console.log('Adding item to cart:', product);
    const items = get().items;
    const existingItem = items.find((item) => item.id === product.id);
    let newItems;
    if (existingItem) {
      newItems = items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...items, { ...product, quantity: 1 }];
    }

    set({ items: newItems, isDirty: true });
  },

  updateQuantity: (id, quantity) => {
    console.log(`Updating quantity for item ${id} to ${quantity}`);
    const items = get().items;
    const newItems = items
      .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
      .filter((item) => item.quantity > 0);
    set({ items: newItems, isDirty: true });
  },

clearCart: () => {
  console.log('Clearing cart');
  if (get().items.length === 0) return;
  set({ items: [], isDirty: true }); },

  getItemCount: () => {
    const items = get().items;
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  totalPrice: () => {
    const items = get().items;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  initializeCart: async () => {
    console.log('Initializing cart from backend...');
    set({ isLoading: true });
    try {
      const serverCart = await cartService.getCart();
      set({ items: serverCart.items, isDirty: false, isLoading: false });
    } catch (e) {
      console.error('Error initializing cart', e);
      set({ isLoading: false });
    }
  },

  syncWithBackend: async () => {
    const { items, isDirty } = get();
    if (!isDirty) return;

    console.log('Syncing cart with backend...', items);
    try {
      await cartService.syncCart(items);
      set({ isDirty: false });
    } catch (e) {
      console.error('Error syncing cart', e);
    }
  },
}));
