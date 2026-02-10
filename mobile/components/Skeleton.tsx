import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.md,
  style,
}: SkeletonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[skeletonStyles.productCard, { backgroundColor: colors.surface }]}>
      <Skeleton width="100%" height={150} borderRadius={BorderRadius.md} />
      <View style={skeletonStyles.productInfo}>
        <Skeleton width="80%" height={14} />
        <Skeleton width="50%" height={12} style={{ marginTop: Spacing.xs }} />
        <Skeleton width="40%" height={16} style={{ marginTop: Spacing.xs }} />
      </View>
      <Skeleton
        width="100%"
        height={36}
        borderRadius={0}
        style={{ marginTop: Spacing.sm }}
      />
    </View>
  );
}

export function CategoryChipsSkeleton() {
  return (
    <View style={skeletonStyles.chipRow}>
      <Skeleton width={60} height={32} borderRadius={9999} />
      <Skeleton width={80} height={32} borderRadius={9999} />
      <Skeleton width={70} height={32} borderRadius={9999} />
      <Skeleton width={90} height={32} borderRadius={9999} />
      <Skeleton width={65} height={32} borderRadius={9999} />
    </View>
  );
}

export function ProductListSkeleton() {
  return (
    <View style={skeletonStyles.productList}>
      {/* Category chips skeleton */}
      <CategoryChipsSkeleton />
      {/* Results bar skeleton */}
      <View style={skeletonStyles.resultsBar}>
        <Skeleton width={90} height={14} />
        <Skeleton width={100} height={28} borderRadius={BorderRadius.md} />
      </View>
      {/* Product grid skeleton */}
      <View style={skeletonStyles.productRow}>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </View>
      <View style={skeletonStyles.productRow}>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </View>
      <View style={skeletonStyles.productRow}>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </View>
    </View>
  );
}

export function OrderCardSkeleton() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[skeletonStyles.orderCard, { backgroundColor: colors.surface }]}>
      <View style={skeletonStyles.orderHeader}>
        <Skeleton width={100} height={12} />
        <Skeleton width={70} height={20} borderRadius={BorderRadius.sm} />
      </View>
      <View style={skeletonStyles.orderItems}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="50%" height={14} style={{ marginTop: Spacing.xs }} />
      </View>
      <View style={skeletonStyles.orderFooter}>
        <Skeleton width={80} height={12} />
        <Skeleton width={60} height={18} />
      </View>
    </View>
  );
}

export function OrderListSkeleton() {
  return (
    <View style={skeletonStyles.orderList}>
      <OrderCardSkeleton />
      <OrderCardSkeleton />
      <OrderCardSkeleton />
    </View>
  );
}

export function OrderDetailSkeleton() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[skeletonStyles.detailContainer, { backgroundColor: colors.background }]}>
      {/* Header card */}
      <View
        style={[
          {
            margin: Spacing.md,
            padding: Spacing.md,
            borderRadius: BorderRadius.lg,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
          <View>
            <Skeleton width={90} height={12} />
            <Skeleton width={120} height={22} style={{ marginTop: Spacing.xs }} />
          </View>
          <Skeleton width={80} height={26} borderRadius={9999} />
        </View>
        <Skeleton width={180} height={13} style={{ marginTop: Spacing.xs }} />
      </View>

      {/* Timeline card */}
      <View
        style={[
          {
            marginHorizontal: Spacing.md,
            marginBottom: Spacing.md,
            padding: Spacing.md,
            borderRadius: BorderRadius.lg,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Skeleton width={130} height={16} style={{ marginBottom: Spacing.sm }} />
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={100} height={14} style={{ marginLeft: Spacing.sm }} />
          </View>
        ))}
      </View>

      {/* Items */}
      <View style={{ paddingHorizontal: Spacing.md }}>
        <Skeleton width={80} height={16} style={{ marginBottom: Spacing.sm }} />
      </View>
      {[1, 2].map((i) => (
        <View
          key={i}
          style={[
            {
              flexDirection: 'row',
              marginHorizontal: Spacing.md,
              marginBottom: Spacing.sm,
              padding: Spacing.sm,
              borderRadius: BorderRadius.lg,
              backgroundColor: colors.surface,
              gap: Spacing.sm,
            },
          ]}
        >
          <Skeleton width={64} height={64} borderRadius={BorderRadius.md} />
          <View style={{ flex: 1 }}>
            <Skeleton width="80%" height={14} />
            <Skeleton width={50} height={12} style={{ marginTop: Spacing.xs }} />
            <Skeleton width={70} height={15} style={{ marginTop: Spacing.xs }} />
          </View>
        </View>
      ))}

      {/* Summary card */}
      <View
        style={[
          {
            marginHorizontal: Spacing.md,
            marginTop: Spacing.sm,
            padding: Spacing.md,
            borderRadius: BorderRadius.lg,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Skeleton width={70} height={16} style={{ marginBottom: Spacing.sm }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
          <Skeleton width={80} height={14} />
          <Skeleton width={60} height={14} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
          <Skeleton width={50} height={14} />
          <Skeleton width={40} height={14} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Skeleton width={50} height={18} />
          <Skeleton width={80} height={20} />
        </View>
      </View>
    </View>
  );
}

export function ProductDetailSkeleton() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[skeletonStyles.detailContainer, { backgroundColor: colors.background }]}>
      <Skeleton width="100%" height={350} borderRadius={0} />
      <View style={skeletonStyles.detailContent}>
        <Skeleton width="70%" height={24} />
        <Skeleton width="30%" height={28} style={{ marginTop: Spacing.sm }} />
        <View
          style={[
            skeletonStyles.sellerSkeleton,
            { backgroundColor: colors.surface },
          ]}>
          <Skeleton width="60%" height={14} />
        </View>
        <Skeleton width="40%" height={18} style={{ marginTop: Spacing.lg }} />
        <Skeleton width="100%" height={14} style={{ marginTop: Spacing.sm }} />
        <Skeleton width="100%" height={14} style={{ marginTop: Spacing.xs }} />
        <Skeleton width="80%" height={14} style={{ marginTop: Spacing.xs }} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
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
