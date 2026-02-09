import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderRepository, type CreateOrderParams } from '@/repositories';

export function useOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      try {
        return await orderRepository.getByUserId(userId!);
      } catch (error) {
        console.error('[useOrders] Failed to fetch orders:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
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
