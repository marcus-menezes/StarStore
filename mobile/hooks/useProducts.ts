import { productRepository } from '@/repositories';
import { useQuery } from '@tanstack/react-query';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productRepository.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productRepository.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
