import { productRepository } from '@/repositories';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useProduct, useProducts } from './useProducts';

jest.mock('@/repositories', () => ({
  productRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
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

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Lightsaber',
    description: 'Elegant weapon',
    price: 199.99,
    seller: 'Jedi Temple',
    imageUrl: 'https://example.com/saber.png',
    createdAt: new Date(),
  },
  {
    id: 'prod-2',
    name: 'Blaster',
    description: 'Simple weapon',
    price: 49.99,
    seller: 'Imperial Surplus',
    imageUrl: 'https://example.com/blaster.png',
    createdAt: new Date(),
  },
];

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all products', async () => {
    (productRepository.getAll as jest.Mock).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProducts);
    expect(productRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('returns error state when fetch fails', async () => {
    (productRepository.getAll as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe('useProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches a single product by id', async () => {
    (productRepository.getById as jest.Mock).mockResolvedValue(mockProducts[0]);

    const { result } = renderHook(() => useProduct('prod-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProducts[0]);
    expect(productRepository.getById).toHaveBeenCalledWith('prod-1');
  });

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useProduct(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(productRepository.getById).not.toHaveBeenCalled();
  });
});
