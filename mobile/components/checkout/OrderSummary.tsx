import { Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { t } from '@/i18n';
import { styles } from '@/styles/checkout.styles';
import { formatCurrency } from '@/utils/formatCurrency';

export interface OrderSummaryProps {
  itemCount: number;
  total: number;
  colorScheme: 'light' | 'dark';
}

export function OrderSummary({ itemCount, total, colorScheme }: OrderSummaryProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('checkout.orderSummary')}
      </Text>
      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            {t('checkout.items')} ({itemCount})
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {formatCurrency(total)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            {t('checkout.shipping')}
          </Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>{t('common.free')}</Text>
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
  );
}
