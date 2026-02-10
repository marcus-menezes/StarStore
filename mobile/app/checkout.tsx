import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useCartStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { useCreateOrder } from '@/hooks/useOrders';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFeedback } from '@/contexts/FeedbackContext';
import Colors from '@/constants/Colors';
import { checkoutSchema, type CheckoutFormData } from '@/schemas';
import { t } from '@/i18n';
import { formatCurrency } from '@/utils/formatCurrency';
import { styles } from './checkout.styles';

// Formatting helpers
const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ').slice(0, 19) : '';
};

const formatExpiryDate = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

export default function CheckoutScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { user, isAuthenticated } = useAuth();
  const { showToast, showModal } = useFeedback();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const createOrder = useCreateOrder();

  const total = getTotal();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!isAuthenticated || !user) {
      showModal({
        title: t('checkout.signInRequired'),
        message: t('checkout.signInRequiredMessage'),
        icon: 'user-circle',
        iconColor: '#2563eb',
        buttons: [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.signIn'), onPress: () => router.push('/(auth)/login') },
        ],
      });
      return;
    }

    if (items.length === 0) {
      showToast({ message: t('checkout.emptyCartMessage'), type: 'warning' });
      return;
    }

    try {
      await createOrder.mutateAsync({
        userId: user.id,
        items,
        total,
        paymentData: {
          cardNumber: data.cardNumber.replace(/\s/g, ''),
          expiryDate: data.expiryDate,
          cvv: data.cvv,
          cardholderName: data.cardholderName,
        },
      });

      clearCart();
      showModal({
        title: t('checkout.orderPlaced'),
        message: t('checkout.orderPlacedMessage'),
        icon: 'check-circle',
        iconColor: '#16a34a',
        buttons: [{ text: t('common.ok'), onPress: () => router.replace('/(tabs)/history') }],
      });
    } catch {
      showToast({ message: t('checkout.errorPlaceOrder'), type: 'error' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('checkout.orderSummary')}
          </Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                {t('checkout.items')} ({items.length})
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {formatCurrency(total)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                {t('checkout.shipping')}
              </Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                {t('common.free')}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>{t('checkout.total')}</Text>
              <Text
                style={[
                  styles.totalValue,
                  { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark },
                ]}
              >
                {formatCurrency(total)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('checkout.paymentDetails')}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('checkout.cardholderName')}
            </Text>
            <Controller
              control={control}
              name="cardholderName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: errors.cardholderName ? colors.error : colors.border,
                    },
                  ]}
                  placeholder={t('checkout.cardholderPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.cardholderName && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.cardholderName.message}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{t('checkout.cardNumber')}</Text>
            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: errors.cardNumber ? colors.error : colors.border,
                    },
                  ]}
                  placeholder={t('checkout.cardNumberPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={19}
                  value={value}
                  onChangeText={(text) => onChange(formatCardNumber(text))}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.cardNumber && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.cardNumber.message}
              </Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={[styles.label, { color: colors.text }]}>{t('checkout.expiryDate')}</Text>
              <Controller
                control={control}
                name="expiryDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: errors.expiryDate ? colors.error : colors.border,
                      },
                    ]}
                    placeholder={t('checkout.expiryPlaceholder')}
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    maxLength={5}
                    value={value}
                    onChangeText={(text) => onChange(formatExpiryDate(text))}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.expiryDate && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.expiryDate.message}
                </Text>
              )}
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={[styles.label, { color: colors.text }]}>{t('checkout.cvv')}</Text>
              <Controller
                control={control}
                name="cvv"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: errors.cvv ? colors.error : colors.border,
                      },
                    ]}
                    placeholder={t('checkout.cvvPlaceholder')}
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.cvv && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.cvv.message}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      >
        <Pressable
          style={[
            styles.checkoutButton,
            { backgroundColor: colors.buttonBackground },
            createOrder.isPending && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <Text style={[styles.checkoutButtonText, { color: colors.buttonText }]}>
              {t('checkout.placeOrder')} - {formatCurrency(total)}
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}