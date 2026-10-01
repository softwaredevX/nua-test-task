import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as storage from '../services/storage/storage';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  themeMode: ThemeMode;
  hydrated: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
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

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setThemeMode: (themeMode: ThemeMode) => set({ themeMode }),
      toggleTheme: () => {
        const current = get().themeMode;
        set({ themeMode: current === 'dark' ? 'light' : 'dark' });
      },
    }),
    {
      name: 'theme_settings',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
