import { StyleSheet } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/Spacing';

export const skeletonStyles = StyleSheet.create({
  productCard: {
    width: '48%',
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  productInfo: {
    padding: Spacing.sm,
  },
  productList: {
    padding: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderItems: {
    marginVertical: Spacing.sm,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  orderList: {
    padding: Spacing.md,
  },
  detailContainer: {
    flex: 1,
  },
  detailContent: {
    padding: Spacing.md,
  },
  sellerSkeleton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
});
