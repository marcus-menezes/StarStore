import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import type { Order, CartItem, PaymentFormData } from '@/types';

const COLLECTION = 'orders';

const fetchOrders = async (userId: string): Promise<Order[]> => {
  const snapshot = await firestore()
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      items: data.items,
      total: data.total,
      status: data.status,
      paymentMethod: data.paymentMethod,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
    } as Order;
  });
};

interface CreateOrderParams {
  userId: string;
  items: CartItem[];
  total: number;
  paymentData: PaymentFormData;
}

const createOrder = async (params: CreateOrderParams): Promise<Order> => {
  const orderData = {
    userId: params.userId,
    items: params.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
    })),
    total: params.total,
    status: 'pending' as const,
    paymentMethod: {
      type: 'credit_card' as const,
      last4: params.paymentData.cardNumber.slice(-4),
      brand: detectCardBrand(params.paymentData.cardNumber),
    },
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await firestore().collection(COLLECTION).add(orderData);

  return {
    id: docRef.id,
    userId: params.userId,
    items: orderData.items,
    total: params.total,
    status: 'pending',
    paymentMethod: orderData.paymentMethod,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

function detectCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  return 'unknown';
}

export function useOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => fetchOrders(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // Invalidate orders query to refetch
      queryClient.invalidateQueries({ queryKey: ['orders', data.userId] });
    },
  });
}
