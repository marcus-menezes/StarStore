import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { Storage } from '@/services/storage';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  /** Resolved color scheme ('light' | 'dark') */
  colorScheme: 'light' | 'dark';
  /** Current user preference ('light' | 'dark' | 'system') */
  themePreference: ThemePreference;
  /** Set the theme preference */
  setThemePreference: (pref: ThemePreference) => void;
}

const STORAGE_KEY = 'theme_preference';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useSystemColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preference
  useEffect(() => {
    Storage.getItem<ThemePreference>(STORAGE_KEY).then((saved) => {
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setThemePreferenceState(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  const setThemePreference = useCallback((pref: ThemePreference) => {
    setThemePreferenceState(pref);
    Storage.setItem(STORAGE_KEY, pref);
  }, []);

  const colorScheme: 'light' | 'dark' =
    themePreference === 'system' ? (systemColorScheme ?? 'light') : themePreference;

  // Don't render until preference is loaded to avoid flash
  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ colorScheme, themePreference, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
