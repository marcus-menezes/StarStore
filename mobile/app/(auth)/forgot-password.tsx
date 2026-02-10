import { yupResolver } from '@hookform/resolvers/yup';
import { Link, router } from 'expo-router';
import { useState } from 'react';
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
import { useColorScheme } from '@/hooks/useColorScheme';
import { t } from '@/i18n';
import { authRepository } from '@/repositories';
import { type ForgotPasswordFormData, createForgotPasswordSchema } from '@/schemas';
import { CrashReport } from '@/services/analytics';
import { useFeedbackStore } from '@/store/feedbackStore';
import { styles } from '@/styles/auth/forgotPassword.styles';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const showToast = useFeedbackStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(createForgotPasswordSchema()),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authRepository.sendPasswordResetEmail(data.email);
      showToast({ message: t('forgotPassword.successMessage'), type: 'success' });
      router.back();
    } catch (error) {
      console.error('[ForgotPasswordScreen] sendPasswordResetEmail failed:', error);
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        'ForgotPasswordScreen.onSubmit'
      );
      showToast({ message: t('forgotPassword.errorMessage'), type: 'error' });
    } finally {
      setIsLoading(false);
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
          {t('forgotPassword.title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('forgotPassword.subtitle')}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('forgotPassword.emailLabel')}
            </Text>
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
                  placeholder={t('forgotPassword.emailPlaceholder')}
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

          <Pressable
            style={[
              styles.sendButton,
              { backgroundColor: colors.buttonBackground },
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={[styles.sendButtonText, { color: colors.buttonText }]}>
                {t('forgotPassword.sendButton')}
              </Text>
            )}
          </Pressable>

          <View style={styles.backContainer}>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text
                  style={[
                    styles.backLink,
                    { color: colorScheme === 'dark' ? Colors.primary : Colors.accent },
                  ]}
                >
                  {t('forgotPassword.backToLogin')}
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
