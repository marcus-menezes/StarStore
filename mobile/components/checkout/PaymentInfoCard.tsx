import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { t } from '@/i18n';
import { styles } from '@/styles/checkout.styles';

export interface PaymentInfoCardProps {
  type: 'pix' | 'boleto';
  colorScheme: 'light' | 'dark';
}

const CONFIG = {
  pix: {
    icon: 'qrcode',
    title: 'checkout.pixTitle' as const,
    description: 'checkout.pixDescription' as const,
    notice: null,
  },
  boleto: {
    icon: 'barcode',
    title: 'checkout.boletoTitle' as const,
    description: 'checkout.boletoDescription' as const,
    notice: 'checkout.boletoNotice' as const,
  },
};

export function PaymentInfoCard({ type, colorScheme }: PaymentInfoCardProps) {
  const colors = Colors[colorScheme];
  const config = CONFIG[type];

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('checkout.paymentDetails')}
      </Text>
      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <FontAwesome5
          name={config.icon}
          size={48}
          color={Colors.accent}
          style={styles.infoIcon}
        />
        <Text style={[styles.infoTitle, { color: colors.text }]}>{t(config.title)}</Text>
        <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
          {t(config.description)}
        </Text>
        {config.notice && (
          <Text style={[styles.infoNotice, { color: colors.textSecondary }]}>
            {t(config.notice)}
          </Text>
        )}
      </View>
    </View>
  );
}
