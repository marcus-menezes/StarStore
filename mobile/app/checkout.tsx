import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  CreditCardForm,
  OrderSummary,
  PaymentInfoCard,
  PaymentMethodSelector,
} from '@/components/checkout';
import Colors from '@/constants/Colors';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCreateOrder } from '@/hooks/useOrders';
import { t } from '@/i18n';
import { type CheckoutFormData, checkoutSchema } from '@/schemas';
import { Analytics, CrashReport } from '@/services/analytics';
import { useCartStore } from '@/store';
import { styles } from '@/styles/checkout.styles';
import type { PaymentMethodType } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs only on mount
  useEffect(() => {
    if (items.length > 0) {
      Analytics.logBeginCheckout(total, items.length);
    }
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema) as never,
    mode: 'onChange',
    defaultValues: {
      paymentMethodType: 'credit_card',
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const selectedMethod = watch('paymentMethodType') as PaymentMethodType;

  const handleSelectMethod = (method: PaymentMethodType) => {
    setValue('paymentMethodType', method, { shouldValidate: true });
  };

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
      const order = await createOrder.mutateAsync({
        userId: user.id,
        items,
        total,
        paymentData: {
          paymentMethodType: data.paymentMethodType as PaymentMethodType,
          cardNumber: data.cardNumber?.replace(/\s/g, ''),
          expiryDate: data.expiryDate,
          cvv: data.cvv,
          cardholderName: data.cardholderName,
        },
      });

      Analytics.logPurchase(order.id, total, items.length);
      clearCart();
      showModal({
        title: t('checkout.orderPlaced'),
        message: t('checkout.orderPlacedMessage'),
        icon: 'check-circle',
        iconColor: '#16a34a',
        buttons: [{ text: t('common.ok'), onPress: () => router.replace('/history') }],
      });
    } catch (error) {
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        'CheckoutScreen.onSubmit'
      );
      showToast({ message: t('checkout.errorPlaceOrder'), type: 'error' });
    }
  };

  const renderPaymentDetails = () => {
    switch (selectedMethod) {
      case 'credit_card':
        return <CreditCardForm control={control} errors={errors} colorScheme={colorScheme} />;
      case 'pix':
        return <PaymentInfoCard type="pix" colorScheme={colorScheme} />;
      case 'boleto':
        return <PaymentInfoCard type="boleto" colorScheme={colorScheme} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onSelect={handleSelectMethod}
          colorScheme={colorScheme}
        />

        {renderPaymentDetails()}

        <OrderSummary itemCount={items.length} total={total} colorScheme={colorScheme} />
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
