import { StyleSheet } from 'react-native';

import { Spacing, BorderRadius } from '@/constants/Spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  form: {
    gap: Spacing.lg,
  },
  field: {},
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
  disabledInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledText: {
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  infoText: {
    fontSize: 15,
    paddingVertical: Spacing.xs,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  saveButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
