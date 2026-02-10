import { StyleSheet } from 'react-native';

import { Spacing, BorderRadius } from '@/constants/Spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: Spacing.md,
  },
  heroSubtitle: {
    fontSize: 14,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  // FAQ
  faqItem: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: Spacing.sm,
  },
  // Contact
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: Spacing.md,
  },
});
