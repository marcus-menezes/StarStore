import { type CreateOrderParams, orderRepository } from '@/repositories';
import { CrashReport } from '@/services/analytics';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      try {
        return await orderRepository.getByUserId(userId!);
      } catch (error) {
        console.error('[useOrders] Failed to fetch orders:', error);
        CrashReport.recordError(
          error instanceof Error ? error : new Error(String(error)),
          'useOrders.queryFn'
        );
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook that returns cached orders from local storage.
 * Use as a fallback when the network query fails.
 */
export function useCachedOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ['orders', userId, 'cached'],
    queryFn: () => orderRepository.getCached(userId!),
    enabled: !!userId,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateOrderParams) => orderRepository.create(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders', data.userId] });
    },
  });
}
