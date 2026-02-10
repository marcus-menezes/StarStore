import { StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1 },
  animatedWrap: {},

  searchSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    letterSpacing: 0.1,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    letterSpacing: 0.1,
  },

  chipsScroll: { flexGrow: 0 },
  chipsContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 2,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    borderColor: 'transparent',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },

  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  resultsCount: { fontSize: 12, fontWeight: '500', letterSpacing: 0.2 },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  sortPillText: { fontSize: 12, fontWeight: '500' },

  sortDropdown: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  sortOptionText: { fontSize: 14 },

  grid: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
  },

  productCard: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  imageContainer: { position: 'relative' },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.imagePlaceholder,
  },
  stockBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  stockDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  stockBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },

  productInfo: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
    minHeight: 34,
    letterSpacing: 0.1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productSeller: { fontSize: 11, flex: 1 },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 1,
  },
  categoryPillText: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0.2,
  },

  cardDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 10,
  },

  addButton: {
    flexDirection: 'row',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: { marginRight: 6 },
  addButtonText: { fontWeight: '600', fontSize: 12, letterSpacing: 0.3 },

  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 38,
    paddingHorizontal: Spacing.md,
  },
  cartControlButton: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  cartQuantityText: { fontSize: 14, fontWeight: 'bold', minWidth: 24, textAlign: 'center' },
});
