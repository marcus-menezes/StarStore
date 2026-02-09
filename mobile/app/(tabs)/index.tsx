import { StyleSheet, FlatList, View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { ProductListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import type { Product } from '@/types';
import { t } from '@/i18n';
import { formatCurrency } from '@/utils/formatCurrency';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { data: products, isLoading, error } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  const colors = Colors[colorScheme];

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('home.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('home.subtitle')}
          </Text>
        </View>
        <ProductListSkeleton />
      </SafeAreaView>
    );
  }

  if (error) {
    console.error('[HomeScreen] Products error:', error);
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: colors.background }]} edges={['top']}>
        <EmptyState
          icon="exclamation-circle"
          title={t('home.errorLoadProducts')}
          subtitle={error.message || t('common.error')}
        />
      </SafeAreaView>
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
            <Text style={[styles.productPrice, { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark }]}>
              {formatCurrency(item.price)}
            </Text>
          </View>
        </Pressable>
      </Link>
      <Pressable
        style={[styles.addButton, { backgroundColor: colors.buttonBackground }]}
        onPress={() => addItem(item)}>
        <Text style={[styles.addButtonText, { color: colors.buttonText }]}>{t('home.addToCart')}</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('home.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('home.subtitle')}
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
    </SafeAreaView>
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  productContent: {
    padding: Spacing.sm,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.imagePlaceholder,
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
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
