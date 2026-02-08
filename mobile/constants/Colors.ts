// Design Tokens - Star Wars Theme
const Colors = {
  // Brand colors
  primary: '#FFE81F', // Star Wars Yellow
  secondary: '#000000', // Black
  accent: '#4A90D9', // Lightsaber Blue

  light: {
    text: '#1A1A1A',
    textSecondary: '#666666',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    tint: '#FFE81F',
    tabIconDefault: '#687076',
    tabIconSelected: '#FFE81F',
    border: '#E0E0E0',
    error: '#DC3545',
    success: '#28A745',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    background: '#0D0D0D',
    surface: '#1A1A1A',
    tint: '#FFE81F',
    tabIconDefault: '#687076',
    tabIconSelected: '#FFE81F',
    border: '#333333',
    error: '#FF6B6B',
    success: '#51CF66',
  },
} as const;

export default Colors;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;
