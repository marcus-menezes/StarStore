import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { data: product, isLoading, error } = useProduct(id);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      // Show feedback
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <FontAwesome name="exclamation-circle" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          Product not found
        </Text>
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.buttonBackground }]}
          onPress={() => router.back()}>
          <Text style={[styles.backButtonText, { color: colors.buttonText }]}>Go Back</Text>
        </Pressable>
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
            <Text style={[styles.price, { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark }]}>
              ${product.price.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.sellerContainer, { backgroundColor: colors.surface }]}>
            <FontAwesome name="store" size={16} color={colors.textSecondary} />
            <Text style={[styles.seller, { color: colors.textSecondary }]}>
              Sold by {product.seller}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {product.description}
            </Text>
          </View>

          {product.category && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
              <View style={[styles.categoryBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  {product.category}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Pressable style={[styles.addToCartButton, { backgroundColor: colors.buttonBackground }]} onPress={handleAddToCart}>
          <FontAwesome name="shopping-cart" size={20} color={colors.buttonText} />
          <Text style={[styles.addToCartText, { color: colors.buttonText }]}>Add to Cart</Text>
        </Pressable>
      </View>
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
  errorText: {
    fontSize: 18,
    marginTop: Spacing.md,
  },
  backButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
  },
  backButtonText: {
    fontWeight: '600',
    fontSize: 16,
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
});
