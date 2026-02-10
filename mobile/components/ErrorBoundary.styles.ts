import { StyleSheet } from 'react-native';

import { Spacing, BorderRadius } from '@/constants/Spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorDetails: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  retryButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
