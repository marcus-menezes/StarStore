import { useState } from 'react';
import { type Control, Controller, type FieldErrors, useWatch } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

import Colors from '@/constants/Colors';
import { t } from '@/i18n';
import type { CheckoutFormData } from '@/schemas';
import { styles } from '@/styles/checkout.styles';

import { CreditCardVisual } from './CreditCardVisual';

// ── Formatters ───────────────────────────────────────
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

// ── Props ────────────────────────────────────────────
export interface CreditCardFormProps {
  control: Control<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  colorScheme: 'light' | 'dark';
}

// ── Component ────────────────────────────────────────
export function CreditCardForm({ control, errors, colorScheme }: CreditCardFormProps) {
  const colors = Colors[colorScheme];
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  const watchedCardNumber = useWatch({ control, name: 'cardNumber' }) ?? '';
  const watchedName = useWatch({ control, name: 'cardholderName' }) ?? '';
  const watchedExpiry = useWatch({ control, name: 'expiryDate' }) ?? '';
  const watchedCvv = useWatch({ control, name: 'cvv' }) ?? '';

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('checkout.paymentDetails')}
      </Text>

      <CreditCardVisual
        cardNumber={watchedCardNumber}
        cardholderName={watchedName}
        expiryDate={watchedExpiry}
        cvv={watchedCvv}
        isCvvFocused={isCvvFocused}
        colorScheme={colorScheme}
      />

      {/* Cardholder Name */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>{t('checkout.cardholderName')}</Text>
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

      {/* Card Number */}
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

      {/* Expiry + CVV */}
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
                secureTextEntry={false}
                value={value}
                onChangeText={onChange}
                onFocus={() => setIsCvvFocused(true)}
                onBlur={() => {
                  setIsCvvFocused(false);
                  onBlur();
                }}
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
  );
}
