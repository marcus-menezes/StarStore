import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { styles } from './CreditCardVisual.styles';

// ── Helpers ──────────────────────────────────────────
const detectCardBrand = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'VISA';
  if (/^5[1-5]/.test(cleaned)) return 'MASTERCARD';
  if (/^3[47]/.test(cleaned)) return 'AMEX';
  if (/^6(?:011|5)/.test(cleaned)) return 'DISCOVER';
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(cleaned)) return 'ELO';
  if (/^(606282|3841)/.test(cleaned)) return 'HIPERCARD';
  return '';
};

const formatDisplayNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  if (!cleaned) return '**** **** **** ****';
  const padded = cleaned.padEnd(16, '*');
  return `${padded.slice(0, 4)} ${padded.slice(4, 8)} ${padded.slice(8, 12)} ${padded.slice(12, 16)}`;
};

// ── Props ────────────────────────────────────────────
export interface CreditCardVisualProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  isCvvFocused: boolean;
  colorScheme: 'light' | 'dark';
}

// ── Component ────────────────────────────────────────
export function CreditCardVisual({
  cardNumber,
  cardholderName,
  expiryDate,
  cvv,
  isCvvFocused,
  colorScheme,
}: CreditCardVisualProps) {
  const brand = detectCardBrand(cardNumber);
  const displayNumber = formatDisplayNumber(cardNumber);
  const displayName = cardholderName || 'SEU NOME AQUI';
  const displayExpiry = expiryDate || 'MM/AA';
  const displayCvv = cvv || '***';

  // ── Flip animation ─────────────────────────────────
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(isCvvFocused ? 180 : 0, { duration: 500 });
  }, [isCvvFocused, rotation]);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` },
    ],
    opacity: interpolate(rotation.value, [0, 89, 90, 180], [1, 1, 0, 0]),
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg` },
    ],
    opacity: interpolate(rotation.value, [0, 89, 90, 180], [0, 0, 1, 1]),
  }));

  // ── Gradient colors ────────────────────────────────
  const gradientFront =
    colorScheme === 'dark'
      ? (['#1a1a2e', '#16213e', '#0f3460'] as const)
      : (['#2c3e50', '#34495e', '#2c3e50'] as const);

  const gradientBack =
    colorScheme === 'dark'
      ? (['#0f3460', '#16213e', '#1a1a2e'] as const)
      : (['#34495e', '#2c3e50', '#34495e'] as const);

  const textColor = '#FFFFFF';
  const dimColor = 'rgba(255,255,255,0.6)';

  return (
    <View style={styles.cardWrapper}>
      {/* ── Front face ───────────────────────────────── */}
      <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
        <LinearGradient
          colors={gradientFront}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.chipRow}>
            <View style={[styles.chip, { backgroundColor: '#C9A84C', borderColor: '#A07E32' }]} />
            <Text style={[styles.brandText, { color: textColor }]}>{brand || 'CARTÃO'}</Text>
          </View>

          <Text style={[styles.numberDisplay, { color: textColor }]}>{displayNumber}</Text>

          <View style={styles.bottomRow}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: dimColor }]}>TITULAR</Text>
              <Text style={[styles.fieldValue, { color: textColor }]} numberOfLines={1}>
                {displayName.toUpperCase()}
              </Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: dimColor }]}>VALIDADE</Text>
              <Text style={[styles.fieldValue, { color: textColor }]}>{displayExpiry}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* ── Back face ────────────────────────────────── */}
      <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
        <LinearGradient
          colors={gradientBack}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.cardGradient}
        >
          <View style={[styles.magneticStrip, { backgroundColor: '#1a1a1a' }]} />

          <View style={styles.cvvSection}>
            <Text style={[styles.cvvLabel, { color: dimColor }]}>CVV</Text>
            <View style={[styles.cvvStrip, { backgroundColor: 'rgba(255,255,255,0.85)' }]}>
              <Text style={[styles.cvvValue, { color: '#1a1a1a' }]}>{displayCvv}</Text>
            </View>
          </View>

          <View style={styles.backBrandRow}>
            <Text style={[styles.backBrandText, { color: dimColor }]}>{brand || 'CARTÃO'}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}
