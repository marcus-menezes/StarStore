import { StyleSheet, FlatList, View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import type { Product } from '@/types';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { data: products, isLoading, error } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  const colors = Colors[colorScheme];

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading products...
        </Text>
      </View>
    );
  }

  if (error) {
    console.error('[HomeScreen] Products error:', error);
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Failed to load products
        </Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>
          {error.message || 'Unknown error'}
        </Text>
      </View>
    );
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={[styles.productCard, { backgroundColor: colors.surface }]}>
      <Link href={`/product/${item.id}`} asChild>
        <Pressable style={styles.productContent}>
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={[styles.productSeller, { color: colors.textSecondary }]}>
              {item.seller}
            </Text>
            <Text style={[styles.productPrice, { color: Colors.primary }]}>
              ${item.price.toFixed(2)}
            </Text>
          </View>
        </Pressable>
      </Link>
      <Pressable
        style={styles.addButton}
        onPress={() => addItem(item)}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>StarStore</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          The galaxy's finest merchandise
        </Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorDetail: {
    fontSize: 12,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  listContent: {
    padding: Spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productContent: {
    padding: Spacing.sm,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    marginTop: Spacing.sm,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    minHeight: 36,
  },
  productSeller: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
});
