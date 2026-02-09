import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import type { Product } from '@/types';

const COLLECTION = 'products';

const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log('[useProducts] Fetching products from Firestore...');
    
    const snapshot = await firestore()
      .collection(COLLECTION)
      .get();

    console.log(`[useProducts] Found ${snapshot.docs.length} products`);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        seller: data.seller,
        imageUrl: data.imageUrl,
        category: data.category,
        stock: data.stock,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      } as Product;
    });
  } catch (error) {
    console.error('[useProducts] Error fetching products:', error);
    throw error;
  }
};

const fetchProductById = async (id: string): Promise<Product | null> => {
  const doc = await firestore().collection(COLLECTION).doc(id).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data()!;
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    seller: data.seller,
    imageUrl: data.imageUrl,
    category: data.category,
    stock: data.stock,
    createdAt: data.createdAt?.toDate() ?? new Date(),
  } as Product;
};

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
