import { useThemeStore } from '@/store/themeStore';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export function useColorScheme(): 'light' | 'dark' {
  const themePreference = useThemeStore((state) => state.themePreference);
  const systemColorScheme = useSystemColorScheme();

  if (themePreference === 'system') {
    return systemColorScheme ?? 'light';
  }

  return themePreference;
}
