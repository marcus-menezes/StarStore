import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useOrders, useCachedOrders, useCreateOrder } from './useOrders';
import { orderRepository } from '@/repositories';

jest.mock('@/repositories', () => ({
  orderRepository: {
    getByUserId: jest.fn(),
    getCached: jest.fn(),
    create: jest.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const mockOrders = [
  {
    id: 'order-1',
    userId: 'user-1',
    items: [],
    total: 199.99,
    status: 'pending' as const,
    paymentMethod: { type: 'credit_card' as const, last4: '1111', brand: 'Visa' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('useOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches orders for a given userId', async () => {
    (orderRepository.getByUserId as jest.Mock).mockResolvedValue(mockOrders);

    const { result } = renderHook(() => useOrders('user-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockOrders);
    expect(orderRepository.getByUserId).toHaveBeenCalledWith('user-1');
  });

  it('does not fetch when userId is undefined', () => {
    const { result } = renderHook(() => useOrders(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(orderRepository.getByUserId).not.toHaveBeenCalled();
  });

  it('reports error when fetch fails', async () => {
    (orderRepository.getByUserId as jest.Mock).mockRejectedValue(
      new Error('Firestore error')
    );

    const { result } = renderHook(() => useOrders('user-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useCachedOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches cached orders', async () => {
    (orderRepository.getCached as jest.Mock).mockResolvedValue(mockOrders);

    const { result } = renderHook(() => useCachedOrders('user-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockOrders);
  });

  it('does not fetch when userId is undefined', () => {
    const { result } = renderHook(() => useCachedOrders(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an order via the repository', async () => {
    const newOrder = { ...mockOrders[0], id: 'new-order' };
    (orderRepository.create as jest.Mock).mockResolvedValue(newOrder);

    const { result } = renderHook(() => useCreateOrder(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.mutate({
        userId: 'user-1',
        items: [],
        total: 100,
        paymentData: {
          cardNumber: '4111111111111111',
          expiryDate: '12/25',
          cvv: '123',
          cardholderName: 'John',
        },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(orderRepository.create).toHaveBeenCalled();
  });
});
