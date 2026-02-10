import '@react-native-firebase/app';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppErrorBoundary } from '@/components/ErrorBoundary';
import Colors from '@/constants/Colors';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { t } from '@/i18n';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(drawer)',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const StarWarsDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
  },
};

const StarWarsLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.text,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <RootLayoutNav />
    </AppThemeProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? StarWarsDarkTheme : StarWarsLightTheme}>
        <AppErrorBoundary>
          <FeedbackProvider>
            <Stack>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="product/[id]"
                options={{
                  headerShown: true,
                  title: t('nav.productDetails'),
                  headerBackTitle: t('common.back'),
                }}
              />
              <Stack.Screen
                name="order/[id]"
                options={{
                  headerShown: true,
                  title: t('nav.orderDetails'),
                  headerBackTitle: t('common.back'),
                }}
              />
              <Stack.Screen
                name="edit-profile"
                options={{
                  headerShown: true,
                  title: t('nav.editProfile'),
                  headerBackTitle: t('common.back'),
                }}
              />
              <Stack.Screen
                name="help"
                options={{
                  headerShown: true,
                  title: t('nav.help'),
                  headerBackTitle: t('common.back'),
                }}
              />
              <Stack.Screen
                name="checkout"
                options={{
                  headerShown: true,
                  title: t('nav.checkout'),
                  presentation: 'modal',
                }}
              />
            </Stack>
          </FeedbackProvider>
        </AppErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
