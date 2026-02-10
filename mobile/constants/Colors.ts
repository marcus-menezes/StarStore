const Colors = {
  primary: '#FFE81F',
  primaryDark: '#8B7500',
  secondary: '#000000',
  accent: '#4A90D9',

  sithRed: '#C62828',

  status: {
    pending: '#FFA500',
    processing: '#007BFF',
    shipped: '#17A2B8',
    delivered: '#28A745',
    cancelled: '#DC3545',
  },

  imagePlaceholder: '#E5E5E5',

  light: {
    text: '#1A1A1A',
    textSecondary: '#555555',
    background: '#F8F8F8',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    tint: '#1A1A1A',
    tabIconDefault: '#888888',
    tabIconSelected: '#1A1A1A',
    border: '#E0E0E0',
    error: '#DC3545',
    success: '#28A745',
    buttonBackground: '#1A1A1A',
    buttonText: '#FFFFFF',
    cardBackground: '#FFFFFF',
    cardBorder: '#E8E8E8',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    background: '#0A0A0A',
    surface: '#151515',
    surfaceElevated: '#1F1F1F',
    tint: '#FFE81F',
    tabIconDefault: '#666666',
    tabIconSelected: '#FFE81F',
    border: '#2A2A2A',
    error: '#FF6B6B',
    success: '#51CF66',
    buttonBackground: '#FFE81F',
    buttonText: '#000000',
    cardBackground: '#151515',
    cardBorder: '#2A2A2A',
  },
} as const;

export default Colors;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light | typeof Colors.dark;
