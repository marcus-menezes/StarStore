import { StyleSheet } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/Spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  actionButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
