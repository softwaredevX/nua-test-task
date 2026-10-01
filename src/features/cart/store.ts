import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from './types';
import * as storage from '../../services/storage/storage';
import { track } from '../../services/analytics/analytics';

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (id: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  clear: () => void;
  setHydrated: () => void;
}

const zustandStorage = {
  getItem: async (key: string) => {
    const val = await storage.getItem<string>(key);
    return val ?? null;
  },
  setItem: async (key: string, value: string) => {
    await storage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    await storage.removeItem(key);
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      add: (newItem) => {
        const existing = get().items.find((i) => i.id === newItem.id);
        const quantity = (existing?.quantity ?? 0) + 1;

        set((s) => ({
          items: existing
            ? s.items.map((i) => (i.id === newItem.id ? { ...i, quantity } : i))
            : [...s.items, { ...newItem, quantity: 1 }],
        }));

        track('add_to_cart', {
          productId: newItem.id,
          productName: newItem.title,
          price: newItem.price,
          quantity,
        });
      },

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      increment: (id) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),

      decrement: (id) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return Math.round(
    items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100,
  ) / 100;
}
