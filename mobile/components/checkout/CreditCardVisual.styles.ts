import { StyleSheet } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/Spacing';

export const styles = StyleSheet.create({
  // ── Card wrapper ─────────────────────────────────
  cardWrapper: {
    height: 200,
    marginBottom: Spacing.lg,
  },

  // ── Animated layer (positioning only) ────────────
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },

  // ── Gradient layer (visual + content) ────────────
  cardGradient: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  // ── Front face ───────────────────────────────────
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    width: 40,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  numberDisplay: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 3,
    textAlign: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  fieldGroup: {
    gap: 2,
    flexShrink: 1,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ── Back face ────────────────────────────────────
  magneticStrip: {
    height: 40,
    marginTop: Spacing.sm,
    marginHorizontal: -Spacing.lg,
  },
  cvvSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  cvvLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    textAlign: 'right',
  },
  cvvStrip: {
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
  },
  cvvValue: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 4,
    fontStyle: 'italic',
  },
  backBrandRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backBrandText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    opacity: 0.6,
  },
});
