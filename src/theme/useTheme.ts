import { useColorScheme } from 'react-native';
import { useThemeStore, ThemeMode } from './themeStore';
import { lightColors, darkColors, ThemeColors } from './tokens';

export function useTheme() {
  const themeMode = useThemeStore((s) => s.themeMode);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const systemColorScheme = useColorScheme();

  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const colors: ThemeColors = isDark ? darkColors : lightColors;
  const resolvedTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';

  return {
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark,
    colors,
    resolvedTheme,
    systemColorScheme,
  };
}
