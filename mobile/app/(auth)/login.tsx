import { yupResolver } from '@hookform/resolvers/yup';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { t } from '@/i18n';
import { type LoginFormData, loginSchema } from '@/schemas';
import { Analytics, CrashReport } from '@/services/analytics';
import { styles } from '@/styles/auth/login.styles';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { signIn, isLoading } = useAuth();
  const { showToast } = useFeedback();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      Analytics.logLogin('email');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('[LoginScreen] signIn failed:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        'LoginScreen.onSubmit'
      );
      showToast({ message: t('login.errorInvalidCredentials'), type: 'error' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colorScheme === 'dark' ? Colors.primary : colors.text }]}
        >
          {t('login.title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('login.subtitle')}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{t('login.emailLabel')}</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: errors.email ? colors.error : colors.border,
                    },
                  ]}
                  placeholder={t('login.emailPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.email.message}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{t('login.passwordLabel')}</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: errors.password ? colors.error : colors.border,
                    },
                  ]}
                  placeholder={t('login.passwordPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.password && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.password.message}
              </Text>
            )}
          </View>

          <Pressable
            style={[
              styles.signInButton,
              { backgroundColor: colors.buttonBackground },
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={[styles.signInButtonText, { color: colors.buttonText }]}>
                {t('login.signInButton')}
              </Text>
            )}
          </Pressable>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              {t('login.noAccount')}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text
                  style={[
                    styles.registerLink,
                    { color: colorScheme === 'dark' ? Colors.primary : Colors.accent },
                  ]}
                >
                  {t('login.signUpLink')}
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
