import { StyleSheet } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/Spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: Spacing.lg,
  },
  guestSubtitle: {
    fontSize: 13,
    marginTop: Spacing.sm,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  signInButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  signInButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  registerButton: {
    borderWidth: 2,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  registerButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: Spacing.sm,
  },
  userEmail: {
    fontSize: 13,
    marginTop: Spacing.xs,
  },
  menuSection: {
    paddingHorizontal: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  menuLabel: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: 15,
  },
  settingsInline: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
  },
  settingsSection: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  settingLabel: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: 15,
  },
  settingValue: {
    fontSize: 14,
  },
  signOutContainer: {
    padding: Spacing.md,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  signOutText: {
    marginLeft: Spacing.sm,
    fontSize: 15,
    fontWeight: '600',
  },
});
