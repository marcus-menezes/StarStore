import { Stack } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { t } from '@/i18n';

export default function AuthLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Stack.Screen
        name="login"
        options={{
          title: t('common.signIn'),
          headerBackTitle: t('common.back'),
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: t('common.createAccount'),
          headerBackTitle: t('common.back'),
        }}
      />
    </Stack>
  );
}
