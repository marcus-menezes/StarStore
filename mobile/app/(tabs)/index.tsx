import { useState, useMemo, useCallback, useRef, memo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { ProductListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import type { Product } from '@/types';
import { t } from '@/i18n';
import { formatCurrency } from '@/utils/formatCurrency';

type SortOption = 'relevance' | 'price_low' | 'price_high' | 'name';
type ThemeColors = typeof Colors.light | typeof Colors.dark;

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'relevance', label: t('home.sortByRelevance') },
  { key: 'price_low', label: t('home.sortByPriceLow') },
  { key: 'price_high', label: t('home.sortByPriceHigh') },
  { key: 'name', label: t('home.sortByName') },
];

// ── Stable selectors ─────────────────────────────────────────────────────────

const selectAddItem = (s: ReturnType<typeof useCartStore.getState>) => s.addItem;
const selectRemoveItem = (s: ReturnType<typeof useCartStore.getState>) => s.removeItem;
const selectUpdateQuantity = (s: ReturnType<typeof useCartStore.getState>) => s.updateQuantity;

function useCartQuantity(productId: string) {
  return useCartStore(
    useCallback(
      (s: ReturnType<typeof useCartStore.getState>) => {
        const found = s.items.find((i) => i.product.id === productId);
        return found ? found.quantity : 0;
      },
      [productId],
    ),
  );
}

// ── Debounce hook ────────────────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Sub-components ───────────────────────────────────────────────────────────

const AddToCartButton = memo(function AddToCartButton({
  product,
  colors,
}: {
  product: Product;
  colors: ThemeColors;
  colorScheme: 'light' | 'dark';
}) {
  const addItem = useCartStore(selectAddItem);
  const removeItem = useCartStore(selectRemoveItem);
  const updateQuantity = useCartStore(selectUpdateQuantity);
  const quantity = useCartQuantity(product.id);

  const [justAdded, setJustAdded] = useState(false);
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;

  const animateBounce = useCallback(() => {
    RNAnimated.sequence([
      RNAnimated.timing(scaleAnim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      RNAnimated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  const handleAdd = useCallback(() => {
    addItem(product);
    setJustAdded(true);
    animateBounce();
    setTimeout(() => setJustAdded(false), 1200);
  }, [addItem, product, animateBounce]);

  const handleIncrement = useCallback(() => {
    updateQuantity(product.id, quantity + 1);
    animateBounce();
  }, [updateQuantity, product.id, quantity, animateBounce]);

  const handleDecrement = useCallback(() => {
    if (quantity <= 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
    animateBounce();
  }, [removeItem, updateQuantity, product.id, quantity, animateBounce]);

  if (quantity > 0 && !justAdded) {
    return (
      <RNAnimated.View style={[styles.animatedWrap, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.cartControls, { backgroundColor: colors.buttonBackground }]}>
          <Pressable style={styles.cartControlButton} onPress={handleDecrement} hitSlop={4}>
            <FontAwesome name={quantity === 1 ? 'trash-o' : 'minus'} size={12} color={colors.buttonText} />
          </Pressable>
          <Text style={[styles.cartQuantityText, { color: colors.buttonText }]}>{quantity}</Text>
          <Pressable style={styles.cartControlButton} onPress={handleIncrement} hitSlop={4}>
            <FontAwesome name="plus" size={12} color={colors.buttonText} />
          </Pressable>
        </View>
      </RNAnimated.View>
    );
  }

  return (
    <RNAnimated.View style={[styles.animatedWrap, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        style={[
          styles.addButton,
          { backgroundColor: justAdded ? colors.success : colors.buttonBackground },
        ]}
        onPress={justAdded ? undefined : handleAdd}
        disabled={justAdded}>
        <FontAwesome
          name={justAdded ? 'check' : 'cart-plus'}
          size={12}
          color={colors.buttonText}
          style={styles.addButtonIcon}
        />
        <Text style={[styles.addButtonText, { color: colors.buttonText }]}>
          {justAdded ? t('home.addedToCart') : t('home.addToCart')}
        </Text>
      </Pressable>
    </RNAnimated.View>
  );
});

function StockBadge({ stock, colors }: { stock?: number; colors: ThemeColors }) {
  if (stock === undefined || stock === null) return null;

  if (stock === 0) {
    return (
      <View style={[styles.stockBadge, { backgroundColor: `${colors.error}20` }]}>
        <View style={[styles.stockDot, { backgroundColor: colors.error }]} />
        <Text style={[styles.stockBadgeText, { color: colors.error }]}>{t('home.outOfStock')}</Text>
      </View>
    );
  }

  if (stock <= 5) {
    return (
      <View style={[styles.stockBadge, { backgroundColor: '#FFA50018' }]}>
        <View style={[styles.stockDot, { backgroundColor: '#E8850C' }]} />
        <Text style={[styles.stockBadgeText, { color: '#E8850C' }]}>{t('home.lowStock')}</Text>
      </View>
    );
  }

  return null;
}

// ── Product card ─────────────────────────────────────────────────────────────

const keyExtractor = (item: Product) => item.id;

const ProductCard = memo(function ProductCard({
  item,
  colors,
  colorScheme,
}: {
  item: Product;
  colors: ThemeColors;
  colorScheme: 'light' | 'dark';
}) {
  const priceColor = colorScheme === 'dark' ? Colors.primary : Colors.primaryDark;

  return (
    <View style={[styles.productCard, { backgroundColor: colors.surface }]}>
      <Link href={`/product/${item.id}`} asChild>
        <Pressable>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={item.imageUrl}
              style={styles.productImage}
              contentFit="cover"
              recyclingKey={item.id}
              transition={200}
            />
            <StockBadge stock={item.stock} colors={colors} />
          </View>

          {/* Info */}
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
              {item.name}
            </Text>

            <View style={styles.metaRow}>
              <FontAwesome name="building-o" size={9} color={colors.textSecondary} />
              <Text style={[styles.productSeller, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.seller}
              </Text>
            </View>

            {item.category != null && (
              <View style={[styles.categoryPill, { backgroundColor: `${colors.border}80` }]}>
                <Text style={[styles.categoryPillText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.category}
                </Text>
              </View>
            )}

            <Text style={[styles.productPrice, { color: priceColor }]}>
              {formatCurrency(item.price)}
            </Text>
          </View>
        </Pressable>
      </Link>

      {/* Divider */}
      <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

      <AddToCartButton product={item} colors={colors} colorScheme={colorScheme} />
    </View>
  );
});

// ── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { data: products, isLoading, error } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set<string>();
    for (const p of products) {
      if (p.category) cats.add(p.category);
    }
    return Array.from(cats).sort((a, b) => {
      const aSelected = selectedCategories.has(a);
      const bSelected = selectedCategories.has(b);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.localeCompare(b);
    });
  }, [products, selectedCategories]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.seller.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query),
      );
    }

    if (selectedCategories.size > 0) {
      result = result.filter((p) => p.category != null && selectedCategories.has(p.category));
    }

    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, debouncedSearch, selectedCategories, sortBy]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sortBy)?.label ?? '';

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard item={item} colors={colors} colorScheme={colorScheme} />
    ),
    [colors, colorScheme],
  );

  const listKey = useMemo(
    () => `${Array.from(selectedCategories).sort().join(',')}_${sortBy}_${debouncedSearch}`,
    [selectedCategories, sortBy, debouncedSearch],
  );

  const clearCategories = useCallback(() => setSelectedCategories(new Set()), []);
  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);
  const clearSearch = useCallback(() => setSearchQuery(''), []);

  // ── Loading ──

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <FontAwesome name="search" size={15} color={colors.textSecondary} />
            <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
              {t('home.searchPlaceholder')}
            </Text>
          </View>
        </View>
        <ProductListSkeleton />
      </SafeAreaView>
    );
  }

  // ── Error ──

  if (error) {
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

  // ── Content ──

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* ── Search ── */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="search" size={15} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} hitSlop={10}>
              <FontAwesome name="times-circle" size={16} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Category chips ── */}
      {categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
          style={styles.chipsScroll}>
          <Pressable
            style={[
              styles.chip,
              selectedCategories.size === 0
                ? [styles.chipActive, { backgroundColor: colors.buttonBackground }]
                : { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={clearCategories}>
            <Text
              style={[
                styles.chipText,
                { color: selectedCategories.size === 0 ? colors.buttonText : colors.textSecondary },
              ]}>
              {t('home.allCategories')}
            </Text>
          </Pressable>
          {categories.map((cat) => {
            const isSelected = selectedCategories.has(cat);
            return (
              <Pressable
                key={cat}
                style={[
                  styles.chip,
                  isSelected
                    ? [styles.chipActive, { backgroundColor: colors.buttonBackground }]
                    : { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={() => toggleCategory(cat)}>
                <Text
                  style={[
                    styles.chipText,
                    { color: isSelected ? colors.buttonText : colors.textSecondary },
                  ]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* ── Toolbar (count + sort) ── */}
      <View style={styles.toolbar}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredProducts.length === 1
            ? t('home.resultsCountSingle')
            : t('home.resultsCount').replace('{count}', String(filteredProducts.length))}
        </Text>
        <Pressable
          style={[styles.sortPill, { backgroundColor: colors.surface }]}
          onPress={() => setShowSortOptions((v) => !v)}>
          <FontAwesome name="sliders" size={12} color={colors.textSecondary} />
          <Text style={[styles.sortPillText, { color: colors.text }]}>{currentSortLabel}</Text>
          <FontAwesome
            name={showSortOptions ? 'chevron-up' : 'chevron-down'}
            size={9}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>

      {/* ── Sort dropdown ── */}
      {showSortOptions && (
        <View
          style={[
            styles.sortDropdown,
            {
              backgroundColor: colors.surface,
              shadowColor: colorScheme === 'dark' ? '#000' : '#888',
            },
          ]}>
          {SORT_OPTIONS.map((option) => {
            const active = sortBy === option.key;
            return (
              <Pressable
                key={option.key}
                style={[
                  styles.sortOption,
                  active && {
                    backgroundColor:
                      colorScheme === 'dark' ? 'rgba(255,232,31,0.08)' : 'rgba(0,0,0,0.03)',
                  },
                ]}
                onPress={() => {
                  setSortBy(option.key);
                  setShowSortOptions(false);
                }}>
                <Text
                  style={[
                    styles.sortOptionText,
                    {
                      color: active
                        ? colorScheme === 'dark'
                          ? Colors.primary
                          : Colors.primaryDark
                        : colors.text,
                      fontWeight: active ? '600' : '400',
                    },
                  ]}>
                  {option.label}
                </Text>
                {active && (
                  <FontAwesome
                    name="check"
                    size={11}
                    color={colorScheme === 'dark' ? Colors.primary : Colors.primaryDark}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      {/* ── Product grid ── */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState icon="search" title={t('home.noResults')} subtitle={t('home.noResultsSubtitle')} />
        </View>
      ) : (
        <FlashList
          key={listKey}
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={keyExtractor}
          numColumns={2}
          drawDistance={400}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1 },
  animatedWrap: {},

  // Search
  searchSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
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

  // Category chips
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

  // Toolbar
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

  // Sort dropdown
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

  // Grid
  grid: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
  },

  // Product card
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

  // Card info
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

  // Divider
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 10,
  },

  // Add to cart
  addButton: {
    flexDirection: 'row',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: { marginRight: 6 },
  addButtonText: { fontWeight: '600', fontSize: 12, letterSpacing: 0.3 },

  // Cart quantity controls
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
