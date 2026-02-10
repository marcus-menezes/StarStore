import { yupResolver } from '@hookform/resolvers/yup';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { t } from '@/i18n';
import { type RegisterFormData, createRegisterSchema } from '@/schemas';
import { Analytics, CrashReport } from '@/services/analytics';
import { useFeedbackStore } from '@/store/feedbackStore';
import { styles } from '@/styles/auth/register.styles';

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { signUp, isLoading } = useAuth();
  const showToast = useFeedbackStore((state) => state.showToast);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(createRegisterSchema()),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data.email, data.password, data.name);
      Analytics.logSignUp('email');
      router.replace('/');
    } catch (error) {
      console.error('[RegisterScreen] signUp failed:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        'RegisterScreen.onSubmit'
      );
      showToast({ message: t('register.errorCreateAccount'), type: 'error' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text
            style={[styles.title, { color: colorScheme === 'dark' ? Colors.primary : colors.text }]}
          >
            {t('register.title')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('register.subtitle')}
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('register.nameLabel')}</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: errors.name ? colors.error : colors.border,
                      },
                    ]}
                    placeholder={t('register.namePlaceholder')}
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.name && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.name.message}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('register.emailLabel')}</Text>
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
                    placeholder={t('register.emailPlaceholder')}
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
              <Text style={[styles.label, { color: colors.text }]}>
                {t('register.passwordLabel')}
              </Text>
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
                    placeholder={t('register.passwordPlaceholder')}
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

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('register.confirmPasswordLabel')}
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: errors.confirmPassword ? colors.error : colors.border,
                      },
                    ]}
                    placeholder={t('register.confirmPasswordPlaceholder')}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            <Pressable
              style={[
                styles.signUpButton,
                { backgroundColor: colors.buttonBackground },
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <Text style={[styles.signUpButtonText, { color: colors.buttonText }]}>
                  {t('register.signUpButton')}
                </Text>
              )}
            </Pressable>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                {t('register.hasAccount')}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text
                    style={[
                      styles.loginLink,
                      { color: colorScheme === 'dark' ? Colors.primary : Colors.accent },
                    ]}
                  >
                    {t('register.signInLink')}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
