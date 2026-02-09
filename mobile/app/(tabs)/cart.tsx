import { StyleSheet, View, Text, FlatList, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useCartStore } from '@/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { EmptyState } from '@/components/EmptyState';
import type { CartItem } from '@/types';
import { t } from '@/i18n';
import { formatCurrency } from '@/utils/formatCurrency';

export default function CartScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = getTotal();

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.emptyContainer, { backgroundColor: colors.background }]} edges={['top']}>
        <EmptyState
          icon="shopping-cart"
          title={t('cart.emptyTitle')}
          subtitle={t('cart.emptySubtitle')}
          actionLabel={t('cart.startShopping')}
          onAction={() => router.push('/(tabs)')}
        />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.surface }]}>
      <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={[styles.itemPrice, { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark }]}>
          {formatCurrency(item.product.price)}
        </Text>
        <View style={styles.quantityContainer}>
          <Pressable
            style={[styles.quantityButton, { borderColor: colors.border }]}
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
            <FontAwesome name="minus" size={12} color={colors.text} />
          </Pressable>
          <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
          <Pressable
            style={[styles.quantityButton, { borderColor: colors.border }]}
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
            <FontAwesome name="plus" size={12} color={colors.text} />
          </Pressable>
        </View>
      </View>
      <Pressable
        style={styles.removeButton}
        onPress={() => removeItem(item.product.id)}>
        <FontAwesome name="trash" size={20} color={colors.error} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('cart.title')}</Text>
        <Pressable onPress={clearCart}>
          <Text style={[styles.clearText, { color: colors.error }]}>{t('cart.clearAll')}</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>{t('cart.total')}</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>{formatCurrency(total)}</Text>
        </View>
        <Pressable 
          style={[styles.checkoutButton, { backgroundColor: colors.buttonBackground }]}
          onPress={() => router.push('/checkout')}>
          <Text style={[styles.checkoutButtonText, { color: colors.buttonText }]}>{t('cart.proceedToCheckout')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
  },
  listContent: {
    padding: Spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.imagePlaceholder,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: Spacing.md,
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    justifyContent: 'center',
    paddingLeft: Spacing.md,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  checkoutButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
