import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useOrders, useCachedOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { OrderDetailSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import type { OrderItem, OrderStatus } from '@/types';
import { t } from '@/i18n';
import { formatCurrency } from '@/utils/formatCurrency';
import { styles } from './[id].styles';

const statusColors = Colors.status;

const STATUS_STEPS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: t('orderDetail.status_pending'),
  processing: t('orderDetail.status_processing'),
  shipped: t('orderDetail.status_shipped'),
  delivered: t('orderDetail.status_delivered'),
  cancelled: t('orderDetail.status_cancelled'),
};

function getStatusIndex(status: OrderStatus): number {
  if (status === 'cancelled') return -1;
  return STATUS_STEPS.indexOf(status);
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { user } = useAuth();
  const { data: remoteOrders, isLoading } = useOrders(user?.id);
  const { data: cachedOrders } = useCachedOrders(user?.id);

  const orders = remoteOrders ?? cachedOrders ?? [];
  const order = orders.find((o) => o.id === id);

  if (isLoading && !order) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="exclamation-circle"
          title={t('orderDetail.notFound')}
          actionLabel={t('common.back')}
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentStepIndex = getStatusIndex(order.status);
  const createdDate = new Date(order.createdAt);
  const updatedDate = new Date(order.updatedAt);

  const renderOrderItem = (item: OrderItem, index: number) => (
    <Pressable
      key={`${item.productId}-${index}`}
      style={[styles.itemCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/product/${item.productId}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
          {item.productName}
        </Text>
        <Text style={[styles.itemQty, { color: colors.textSecondary }]}>
          {t('orderDetail.qty')}: {item.quantity}
        </Text>
        <Text
          style={[
            styles.itemPrice,
            { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark },
          ]}
        >
          {formatCurrency(item.price * item.quantity)}
        </Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color={colors.textSecondary} />
    </Pressable>
  );

  const renderStatusTimeline = () => (
    <View style={[styles.timelineContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('orderDetail.statusTitle')}
      </Text>

      {isCancelled ? (
        <View style={styles.cancelledBanner}>
          <FontAwesome name="times-circle" size={20} color={statusColors.cancelled} />
          <Text style={[styles.cancelledText, { color: statusColors.cancelled }]}>
            {t('orderDetail.statusCancelled')}
          </Text>
        </View>
      ) : (
        <View style={styles.timeline}>
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLast = index === STATUS_STEPS.length - 1;
            const stepColor = isCompleted
              ? statusColors[step]
              : colors.border;

            return (
              <View key={step} style={styles.timelineStep}>
                <View style={styles.timelineIndicator}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: stepColor,
                        borderColor: isCurrent ? stepColor : 'transparent',
                        borderWidth: isCurrent ? 3 : 0,
                      },
                    ]}
                  >
                    {isCompleted && (
                      <FontAwesome
                        name={isCurrent ? 'circle' : 'check'}
                        size={isCurrent ? 8 : 10}
                        color="#fff"
                      />
                    )}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: index < currentStepIndex
                            ? statusColors[STATUS_STEPS[index + 1]]
                            : colors.border,
                        },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineLabel,
                      {
                        color: isCompleted ? colors.text : colors.textSecondary,
                        fontWeight: isCurrent ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {STATUS_LABELS[step]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order header */}
        <View style={[styles.headerCard, { backgroundColor: colors.surface }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.orderIdLabel, { color: colors.textSecondary }]}>
                {t('orderDetail.orderNumber')}
              </Text>
              <Text style={[styles.orderId, { color: colors.text }]}>
                #{order.id.slice(-8).toUpperCase()}
              </Text>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}
            >
              <Text style={styles.statusText}>
                {STATUS_LABELS[order.status]}
              </Text>
            </View>
          </View>
          <View style={styles.dateRow}>
            <FontAwesome name="calendar" size={12} color={colors.textSecondary} />
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              {t('orderDetail.placedOn')}{' '}
              {createdDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
          {order.createdAt !== order.updatedAt && (
            <View style={styles.dateRow}>
              <FontAwesome name="refresh" size={12} color={colors.textSecondary} />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {t('orderDetail.updatedOn')}{' '}
                {updatedDate.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Status timeline */}
        {renderStatusTimeline()}

        {/* Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: Spacing.md }]}>
            {t('orderDetail.items')} ({order.items.length})
          </Text>
          {order.items.map(renderOrderItem)}
        </View>

        {/* Payment info */}
        <View style={[styles.paymentCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('orderDetail.payment')}
          </Text>
          <View style={styles.paymentRow}>
            <FontAwesome name="credit-card" size={16} color={colors.textSecondary} />
            <Text style={[styles.paymentText, { color: colors.text }]}>
              {order.paymentMethod.brand === 'unknown'
                ? 'Cartão de Crédito'
                : order.paymentMethod.brand}{' '}
              •••• {order.paymentMethod.last4}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('orderDetail.summary')}
          </Text>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {t('orderDetail.subtotal')}
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formatCurrency(order.total)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {t('orderDetail.shipping')}
            </Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {t('common.free')}
            </Text>
          </View>

          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              {t('common.total')}
            </Text>
            <Text
              style={[
                styles.totalValue,
                { color: colorScheme === 'dark' ? Colors.primary : Colors.primaryDark },
              ]}
            >
              {formatCurrency(order.total)}
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}