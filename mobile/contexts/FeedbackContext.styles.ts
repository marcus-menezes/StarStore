import { Dimensions, StyleSheet } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/Spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  // Toast
  toastContainer: {
    position: 'absolute',
    top: 55,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH - Spacing.md * 2,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayPress: {
    ...StyleSheet.absoluteFillObject,
  },
  // Modal card
  modalCard: {
    width: SCREEN_WIDTH - Spacing.xl * 2,
    maxWidth: 360,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalMessage: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  buttonsColumn: {
    gap: Spacing.sm,
    width: '100%',
  },
  modalButton: {
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonFlex: {
    flex: 1,
  },
  modalButtonOutline: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
