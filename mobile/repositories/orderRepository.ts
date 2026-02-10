import { CrashReport } from '@/services/analytics';
import { Storage } from '@/services/storage';
import type { CartItem, Order, PaymentFormData } from '@/types';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  where,
} from '@react-native-firebase/firestore';

// Infer Firestore types from the modular API (named type exports not available)
type QueryDocumentSnapshot = Awaited<ReturnType<typeof getDocs>>['docs'][number];

const ORDERS_CACHE_KEY = 'cached_orders';

export interface CreateOrderParams {
  userId: string;
  items: CartItem[];
  total: number;
  paymentData: PaymentFormData;
}

// Repository interface (Dependency Inversion)
export interface IOrderRepository {
  getByUserId(userId: string): Promise<Order[]>;
  create(params: CreateOrderParams): Promise<Order>;
  getCached(userId: string): Promise<Order[] | null>;
}

// Firebase implementation (modular API)
export class OrderRepository implements IOrderRepository {
  private readonly collectionName = 'orders';

  private get db() {
    return getFirestore();
  }

  async getByUserId(userId: string): Promise<Order[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const orders = snapshot.docs.map((docSnap: QueryDocumentSnapshot) => this.mapDocument(docSnap));

    // Persist to local storage for offline access
    await Storage.setItem(`${ORDERS_CACHE_KEY}_${userId}`, orders);

    return orders;
  }

  async create(params: CreateOrderParams): Promise<Order> {
    const colRef = collection(this.db, this.collectionName);

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
        brand: this.detectCardBrand(params.paymentData.cardNumber),
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(colRef, orderData);

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
  }

  async getCached(userId: string): Promise<Order[] | null> {
    try {
      return await Storage.getItem<Order[]>(`${ORDERS_CACHE_KEY}_${userId}`);
    } catch (error) {
      CrashReport.recordError(
        error instanceof Error ? error : new Error(String(error)),
        'OrderRepository.getCached'
      );
      return null;
    }
  }

  private detectCardBrand(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(cleaned)) return 'Elo';
    if (/^(606282|3841)/.test(cleaned)) return 'Hipercard';
    return 'Cartão de Crédito';
  }

  private mapDocument(docSnap: QueryDocumentSnapshot): Order {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId,
      items: data.items,
      total: data.total,
      status: data.status,
      paymentMethod: data.paymentMethod,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
    };
  }
}

// Singleton instance
export const orderRepository = new OrderRepository();
