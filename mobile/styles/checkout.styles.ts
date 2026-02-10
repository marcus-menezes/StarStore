import { StyleSheet } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/Spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // ── Payment Method Selector ──────────────────────
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  paymentMethodOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: Spacing.xs,
  },
  paymentMethodSelected: {
    borderWidth: 2,
  },
  paymentMethodLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ── Card Form Inputs ─────────────────────────────
  inputContainer: {
    marginBottom: Spacing.md,
  },
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
  errorText: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },

  // ── Pix / Boleto Info ────────────────────────────
  infoCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoIcon: {
    marginBottom: Spacing.xs,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoNotice: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },

  // ── Order Summary ────────────────────────────────
  summaryCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // ── Footer ───────────────────────────────────────
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  checkoutButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
