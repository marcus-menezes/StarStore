import { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Animated as RNAnimated,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { ProductDetailSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { t } from '@/i18n';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { data: product, isLoading, error } = useProduct(id);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const quantity = useCartStore((state) => {
    const found = state.items.find((i) => i.product.id === id);
    return found ? found.quantity : 0;
  });

  const [justAdded, setJustAdded] = useState(false);
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;

  const animateBounce = useCallback(() => {
    RNAnimated.sequence([
      RNAnimated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      RNAnimated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      addItem(product);
      setJustAdded(true);
      animateBounce();
      setTimeout(() => setJustAdded(false), 1200);
    }
  }, [product, addItem, animateBounce]);

  const handleIncrement = useCallback(() => {
    updateQuantity(id, quantity + 1);
    animateBounce();
  }, [updateQuantity, id, quantity, animateBounce]);

  const handleDecrement = useCallback(() => {
    if (quantity <= 1) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity - 1);
    }
    animateBounce();
  }, [removeItem, updateQuantity, id, quantity, animateBounce]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="exclamation-circle"
          title={t('product.notFound')}
          actionLabel={t('product.goBack')}
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
            <Text
              style={[
                styles.price,
                { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark },
              ]}
            >
              {formatCurrency(product.price)}
            </Text>
          </View>

          <View style={[styles.sellerContainer, { backgroundColor: colors.surface }]}>
            <FontAwesome name="building" size={16} color={colors.textSecondary} />
            <Text style={[styles.seller, { color: colors.textSecondary }]}>
              {t('product.soldBy')} {product.seller}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('product.description')}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {product.description}
            </Text>
          </View>

          {product.category && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('product.category')}
              </Text>
              <View style={[styles.categoryBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  {product.category}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <RNAnimated.View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {quantity > 0 && !justAdded ? (
          <View style={[styles.addToCartButton, { backgroundColor: colors.buttonBackground }]}>
            <Pressable style={styles.footerControlButton} onPress={handleDecrement} hitSlop={8}>
              <FontAwesome
                name={quantity === 1 ? 'trash-o' : 'minus'}
                size={16}
                color={colors.buttonText}
              />
            </Pressable>
            <Text style={[styles.footerQuantityText, { color: colors.buttonText }]}>
              {quantity}
            </Text>
            <Pressable style={styles.footerControlButton} onPress={handleIncrement} hitSlop={8}>
              <FontAwesome name="plus" size={16} color={colors.buttonText} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[
              styles.addToCartButton,
              { backgroundColor: justAdded ? colors.success : colors.buttonBackground },
            ]}
            onPress={justAdded ? undefined : handleAddToCart}
            disabled={justAdded}
          >
            <FontAwesome
              name={justAdded ? 'check' : 'shopping-cart'}
              size={20}
              color={colors.buttonText}
            />
            <Text style={[styles.addToCartText, { color: colors.buttonText }]}>
              {justAdded ? t('home.addedToCart') : t('product.addToCart')}
            </Text>
          </Pressable>
        )}
      </RNAnimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
