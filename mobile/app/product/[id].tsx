import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, Animated as RNAnimated, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ProductDetailSkeleton } from '@/components/Skeleton';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useProduct } from '@/hooks/useProducts';
import { t } from '@/i18n';
import { Analytics } from '@/services/analytics';
import { useCartStore } from '@/store';
import { styles } from '@/styles/product/product-detail.styles';
import { shareProduct } from '@/utils/deepLinking';
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

  useEffect(() => {
    if (product) {
      Analytics.logViewItem(product.id, product.name, product.price, product.category);
    }
  }, [product]);

  const handleShare = useCallback(() => {
    if (product) {
      shareProduct(product);
    }
  }, [product]);

  const animateBounce = useCallback(() => {
    RNAnimated.sequence([
      RNAnimated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      RNAnimated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      addItem(product);
      Analytics.logAddToCart(product.id, product.name, product.price);
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
      if (product) {
        Analytics.logRemoveFromCart(product.id, product.name);
      }
    } else {
      updateQuantity(id, quantity - 1);
    }
    animateBounce();
  }, [removeItem, updateQuantity, id, quantity, animateBounce, product]);

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
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={handleShare} hitSlop={10} style={styles.shareButton}>
              <FontAwesome name="share-alt" size={20} color={colors.text} />
            </Pressable>
          ),
        }}
      />
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
