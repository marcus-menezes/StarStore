import { StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.imagePlaceholder,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  seller: {
    marginLeft: Spacing.sm,
    fontSize: 14,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerControlButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerQuantityText: {
    fontSize: 17,
    fontWeight: 'bold',
    minWidth: 28,
    textAlign: 'center',
  },
});
