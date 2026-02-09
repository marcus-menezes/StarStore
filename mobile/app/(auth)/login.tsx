import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { loginSchema, type LoginFormData } from '@/schemas';
import { t } from '@/i18n';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { signIn, isLoading } = useAuth();

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
      router.replace('/(tabs)');
    } catch (error) {
      console.error('[LoginScreen] signIn failed:', error);
      Alert.alert(t('common.error'), t('login.errorInvalidCredentials'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? Colors.primary : colors.text }]}>{t('login.title')}</Text>
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
            style={[styles.signInButton, { backgroundColor: colors.buttonBackground }, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={[styles.signInButtonText, { color: colors.buttonText }]}>{t('login.signInButton')}</Text>
            )}
          </Pressable>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              {t('login.noAccount')}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={[styles.registerLink, { color: colorScheme === 'dark' ? Colors.primary : Colors.accent }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  form: {
    gap: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  signInButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
