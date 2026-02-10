import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={64} color={colors.textSecondary} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.buttonBackground }]}
          onPress={onAction}>
          <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}