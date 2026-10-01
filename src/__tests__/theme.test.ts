import { lightColors, darkColors, colors } from '../theme/tokens';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { useThemeStore } from '../theme/themeStore';
import { getReturnPolicyHtml } from '../features/webview/constants/returnPolicyHtml';

describe('Theme System', () => {
  beforeEach(() => {
    useThemeStore.setState({ themeMode: 'system' });
  });

  describe('Theme Tokens', () => {
    it('has identical keys in lightColors and darkColors', () => {
      const lightKeys = Object.keys(lightColors).sort();
      const darkKeys = Object.keys(darkColors).sort();
      expect(lightKeys).toEqual(darkKeys);
    });

    it('exports colors matching lightColors by default for backward compatibility', () => {
      expect(colors).toEqual(lightColors);
    });

    it('contains valid hex color strings for key tokens', () => {
      const hexRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
      expect(lightColors.bg).toMatch(hexRegex);
      expect(darkColors.bg).toMatch(hexRegex);
      expect(lightColors.text).toMatch(hexRegex);
      expect(darkColors.text).toMatch(hexRegex);
      expect(lightColors.accent).toMatch(hexRegex);
      expect(darkColors.accent).toMatch(hexRegex);
    });

    it('provides distinct backgrounds for light and dark modes', () => {
      expect(lightColors.bg).not.toBe(darkColors.bg);
      expect(lightColors.bgSecondary).not.toBe(darkColors.bgSecondary);
      expect(lightColors.text).not.toBe(darkColors.text);
    });
  });

  describe('useThemeStore', () => {
    it('initializes with system mode', () => {
      expect(useThemeStore.getState().themeMode).toBe('system');
    });

    it('updates theme mode with setThemeMode', () => {
      useThemeStore.getState().setThemeMode('dark');
      expect(useThemeStore.getState().themeMode).toBe('dark');

      useThemeStore.getState().setThemeMode('light');
      expect(useThemeStore.getState().themeMode).toBe('light');

      useThemeStore.getState().setThemeMode('system');
      expect(useThemeStore.getState().themeMode).toBe('system');
    });

    it('toggles theme directly between dark and light', () => {
      useThemeStore.getState().setThemeMode('light');

      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().themeMode).toBe('dark');

      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().themeMode).toBe('light');
    });
  });

  describe('getReturnPolicyHtml', () => {
    it('injects dark class when isDark is true', () => {
      const html = getReturnPolicyHtml(true);
      expect(html).toContain('<body class="dark">');
    });

    it('injects light class when isDark is false', () => {
      const html = getReturnPolicyHtml(false);
      expect(html).toContain('<body class="light">');
    });
  });
});
