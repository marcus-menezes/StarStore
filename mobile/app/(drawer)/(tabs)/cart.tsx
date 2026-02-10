import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useCartStore } from '@/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { EmptyState } from '@/components/EmptyState';
import { AppHeader } from '@/components/AppHeader';
import type { CartItem } from '@/types';
import { t } from '@/i18n';
import { formatCurrency } from '@/utils/formatCurrency';
import { styles } from '@/styles/tabs/cart.styles';

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
      <SafeAreaView
        style={[styles.emptyContainer, { backgroundColor: colors.background }]}
        edges={['top']}
      >
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
        <Text
          style={[
            styles.itemPrice,
            { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark },
          ]}
        >
          {formatCurrency(item.product.price)}
        </Text>
        <View style={styles.quantityContainer}>
          <Pressable
            style={[styles.quantityButton, { borderColor: colors.border }]}
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
          >
            <FontAwesome name="minus" size={12} color={colors.text} />
          </Pressable>
          <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
          <Pressable
            style={[styles.quantityButton, { borderColor: colors.border }]}
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <FontAwesome name="plus" size={12} color={colors.text} />
          </Pressable>
        </View>
      </View>
      <Pressable style={styles.removeButton} onPress={() => removeItem(item.product.id)}>
        <FontAwesome name="trash" size={20} color={colors.error} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <AppHeader title={t('cart.title')} />

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Pressable onPress={clearCart} style={styles.clearButton}>
            <FontAwesome name="trash-o" size={14} color={colors.error} />
            <Text style={[styles.clearText, { color: colors.error }]}>{t('cart.clearCart')}</Text>
          </Pressable>
        }
      />

      <View
        style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      >
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
            {t('cart.total')}
          </Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>{formatCurrency(total)}</Text>
        </View>
        <Pressable
          style={[styles.checkoutButton, { backgroundColor: colors.buttonBackground }]}
          onPress={() => router.push('/checkout')}
        >
          <Text style={[styles.checkoutButtonText, { color: colors.buttonText }]}>
            {t('cart.proceedToCheckout')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}