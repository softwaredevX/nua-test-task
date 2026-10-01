export const lightColors = {
  bg: '#ffffff',
  bgSecondary: '#f7f6f5',
  bgTertiary: '#ebebea',
  card: '#ffffff',
  border: '#e9e9e7',
  borderFocus: '#b3b3b3',
  text: '#37352f',
  textSecondary: '#787774',
  textTertiary: '#9b9a97',
  textInverse: '#ffffff',
  accent: '#2383e2',
  accentLight: '#e7f0fc',
  accentDark: '#1a6ab8',
  error: '#eb5757',
  errorLight: '#fde8e8',
  success: '#2d9a74',
  successLight: '#e6f5f0',
  cart: '#37352f',
  star: '#d9a800',
  badgeText: '#ffffff',
} as const;

export const darkColors = {
  bg: '#191919',
  bgSecondary: '#121212',
  bgTertiary: '#282828',
  card: '#202020',
  border: '#2e2e2e',
  borderFocus: '#555555',
  text: '#ebebeb',
  textSecondary: '#9b9a97',
  textTertiary: '#706f6b',
  textInverse: '#191919',
  accent: '#3b82f6',
  accentLight: '#1e293b',
  accentDark: '#60a5fa',
  error: '#f87171',
  errorLight: '#371c1c',
  success: '#34d399',
  successLight: '#132c23',
  cart: '#ebebeb',
  star: '#fbbf24',
  badgeText: '#ffffff',
} as const;

export type ThemeColors = {
  [K in keyof typeof lightColors]: string;
};

export const colors: ThemeColors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

export const border = {
  thin: 1,
} as const;
