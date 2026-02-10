import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { t } from '@/i18n';
import { styles } from '@/styles/checkout.styles';
import type { PaymentMethodType } from '@/types';

type MethodOption = {
  type: PaymentMethodType;
  label: string;
  icon: string;
};

const PAYMENT_METHODS: MethodOption[] = [
  { type: 'credit_card', label: 'checkout.creditCard', icon: 'credit-card' },
  { type: 'pix', label: 'checkout.pix', icon: 'qrcode' },
  { type: 'boleto', label: 'checkout.boleto', icon: 'barcode' },
];

export interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  colorScheme: 'light' | 'dark';
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  colorScheme,
}: PaymentMethodSelectorProps) {
  const colors = Colors[colorScheme];
  const accentColor = colorScheme === 'dark' ? Colors.primary : Colors.primaryDark;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('checkout.paymentMethod')}
      </Text>
      <View style={styles.paymentMethodContainer}>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.type;
          return (
            <Pressable
              key={method.type}
              onPress={() => onSelect(method.type)}
              style={[
                styles.paymentMethodOption,
                { backgroundColor: colors.surface },
                isSelected && [styles.paymentMethodSelected, { borderColor: accentColor }],
              ]}
            >
              <FontAwesome5
                name={method.icon}
                size={22}
                color={isSelected ? accentColor : colors.textSecondary}
              />
              <Text
                style={[
                  styles.paymentMethodLabel,
                  { color: isSelected ? accentColor : colors.textSecondary },
                ]}
              >
                {t(method.label as Parameters<typeof t>[0])}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
