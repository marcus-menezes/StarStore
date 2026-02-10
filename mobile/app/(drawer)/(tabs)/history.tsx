import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useOrders, useCachedOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { OrderListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { AppHeader } from '@/components/AppHeader';
import type { Order } from '@/types';
import { t } from '@/i18n';
import { formatCurrency } from '@/utils/formatCurrency';

const statusColors = Colors.status;

export default function HistoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { user, isAuthenticated } = useAuth();
  const { data: remoteOrders, isLoading, error } = useOrders(user?.id);
  const { data: cachedOrders } = useCachedOrders(user?.id);

  // Use remote orders when available, fallback to cached orders
  const orders = remoteOrders ?? cachedOrders ?? undefined;

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={[styles.emptyContainer, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <EmptyState
          icon="user-circle"
          title={t('history.signInTitle')}
          subtitle={t('history.signInSubtitle')}
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <AppHeader title={t('history.title')} />
        <OrderListSkeleton />
      </SafeAreaView>
    );
  }

  if (error && (!orders || orders.length === 0)) {
    return (
      <SafeAreaView
        style={[styles.emptyContainer, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <EmptyState
          icon="exclamation-circle"
          title={t('history.errorTitle')}
          subtitle={t('history.errorSubtitle')}
        />
      </SafeAreaView>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <SafeAreaView
        style={[styles.emptyContainer, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <EmptyState
          icon="history"
          title={t('history.emptyTitle')}
          subtitle={t('history.emptySubtitle')}
        />
      </SafeAreaView>
    );
  }

  const renderOrder = ({ item }: { item: Order }) => (
    <Pressable
      style={({ pressed }) => [
        styles.orderCard,
        { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={() => router.push(`/order/${item.id}`)}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: colors.textSecondary }]}>
          {t('history.orderPrefix')} #{item.id.slice(-8)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.slice(0, 2).map((orderItem) => (
          <Text
            key={orderItem.productId}
            style={[styles.itemText, { color: colors.text }]}
            numberOfLines={1}
          >
            {orderItem.quantity}x {orderItem.productName}
          </Text>
        ))}
        {item.items.length > 2 && (
          <Text style={[styles.moreItems, { color: colors.textSecondary }]}>
            +{item.items.length - 2} {t('history.moreItems')}
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text
          style={[
            styles.orderTotal,
            { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark },
          ]}
        >
          {formatCurrency(item.total)}
        </Text>
      </View>

      <Text
        style={[
          styles.viewDetails,
          { color: colorScheme === 'dark' ? Colors.primary : Colors.light.textSecondary },
        ]}
      >
        {t('history.viewDetails')}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <AppHeader title={t('history.title')} />

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  listContent: {
    padding: Spacing.md,
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
  orderId: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  orderItems: {
    marginVertical: Spacing.sm,
  },
  itemText: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  moreItems: {
    fontSize: 12,
    fontStyle: 'italic',
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
  orderDate: {
    fontSize: 12,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewDetails: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
});
