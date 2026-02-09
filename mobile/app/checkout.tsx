import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useCartStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { useCreateOrder } from '@/hooks/useOrders';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { checkoutSchema, type CheckoutFormData } from '@/schemas';

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
      Alert.alert('Sign In Required', 'Please sign in to complete your purchase', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/(auth)/login') },
      ]);
      return;
    }

    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty');
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
      Alert.alert('Order Placed!', 'Thank you for your purchase. Your order has been placed successfully.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/history') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Items ({items.length})
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ${total.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Shipping</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark }]}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Details</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Cardholder Name</Text>
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
                  placeholder="Name on card"
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
            <Text style={[styles.label, { color: colors.text }]}>Card Number</Text>
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
                  placeholder="1234 5678 9012 3456"
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
              <Text style={[styles.label, { color: colors.text }]}>Expiry Date</Text>
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
                    placeholder="MM/YY"
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
              <Text style={[styles.label, { color: colors.text }]}>CVV</Text>
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
                    placeholder="123"
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

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Pressable
          style={[styles.checkoutButton, { backgroundColor: colors.buttonBackground }, createOrder.isPending && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={createOrder.isPending}>
          {createOrder.isPending ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <Text style={[styles.checkoutButtonText, { color: colors.buttonText }]}>Place Order - ${total.toFixed(2)}</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  summaryCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: Spacing.md,
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  checkoutButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
