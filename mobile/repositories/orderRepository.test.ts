import type { CartItem, PaymentFormData, PaymentMethod } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import { type CreateOrderParams, OrderRepository } from './orderRepository';

// Create a fresh instance for each test to avoid shared state
let repo: OrderRepository;

beforeEach(() => {
  jest.clearAllMocks();
  repo = new OrderRepository();
});

const mockCartItems: CartItem[] = [
  {
    product: {
      id: 'p1',
      name: 'Lightsaber',
      description: 'Elegant weapon',
      price: 199.99,
      seller: 'Jedi Temple',
      imageUrl: 'https://example.com/saber.png',
      createdAt: new Date(),
    },
    quantity: 2,
  },
  {
    product: {
      id: 'p2',
      name: 'Blaster',
      description: 'Hokey religion',
      price: 49.99,
      seller: 'Imperial Surplus',
      imageUrl: 'https://example.com/blaster.png',
      createdAt: new Date(),
    },
    quantity: 1,
  },
];

describe('OrderRepository', () => {
  describe('getByUserId', () => {
    it('queries Firestore with correct filters and returns mapped orders', async () => {
      const mockDocs = [
        {
          id: 'order-1',
          data: () => ({
            userId: 'user-1',
            items: [],
            total: 100,
            status: 'pending',
            paymentMethod: { type: 'credit_card', last4: '1111', brand: 'Visa' },
            createdAt: { toDate: () => new Date('2024-01-01') },
            updatedAt: { toDate: () => new Date('2024-01-01') },
          }),
        },
      ];

      (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });
      (collection as jest.Mock).mockReturnValue('orders-col');
      (query as jest.Mock).mockReturnValue('query-ref');

      const orders = await repo.getByUserId('user-1');

      expect(collection).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', 'user-1');
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(orders).toHaveLength(1);
      expect(orders[0].id).toBe('order-1');
      expect(orders[0].status).toBe('pending');
    });

    it('caches orders to AsyncStorage after fetching', async () => {
      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
      (collection as jest.Mock).mockReturnValue('col');
      (query as jest.Mock).mockReturnValue('q');

      await repo.getByUserId('user-1');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('cached_orders_user-1', expect.any(String));
    });
  });

  // ── Create with credit card ──────────────────────
  describe('create (credit card)', () => {
    it('creates order with credit card payment method', async () => {
      const mockDocRef = { id: 'new-order-1' };
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (collection as jest.Mock).mockReturnValue('orders-col');

      const params: CreateOrderParams = {
        userId: 'user-1',
        items: mockCartItems,
        total: 449.97,
        paymentData: {
          paymentMethodType: 'credit_card',
          cardNumber: '4111 1111 1111 1111',
          expiryDate: '12/25',
          cvv: '123',
          cardholderName: 'John Doe',
        },
      };

      const order = await repo.create(params);

      expect(addDoc).toHaveBeenCalledWith(
        'orders-col',
        expect.objectContaining({
          userId: 'user-1',
          total: 449.97,
          status: 'pending',
          paymentMethod: expect.objectContaining({
            type: 'credit_card',
            last4: '1111',
            brand: 'Visa',
          }),
        })
      );
      expect(order.id).toBe('new-order-1');
      expect(order.status).toBe('pending');
      expect(order.paymentMethod.type).toBe('credit_card');
    });

    it('maps cart items to order items correctly', async () => {
      (addDoc as jest.Mock).mockResolvedValue({ id: 'order-1' });
      (collection as jest.Mock).mockReturnValue('col');

      const params: CreateOrderParams = {
        userId: 'user-1',
        items: mockCartItems,
        total: 449.97,
        paymentData: {
          paymentMethodType: 'credit_card',
          cardNumber: '5111111111111111',
          expiryDate: '12/25',
          cvv: '123',
          cardholderName: 'John',
        },
      };

      await repo.create(params);

      const callArgs = (addDoc as jest.Mock).mock.calls[0][1];
      expect(callArgs.items).toHaveLength(2);
      expect(callArgs.items[0]).toEqual({
        productId: 'p1',
        productName: 'Lightsaber',
        price: 199.99,
        quantity: 2,
        imageUrl: 'https://example.com/saber.png',
      });
    });
  });

  // ── Create with Pix ──────────────────────────────
  describe('create (pix)', () => {
    it('creates order with pix payment method', async () => {
      const mockDocRef = { id: 'pix-order-1' };
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (collection as jest.Mock).mockReturnValue('orders-col');

      const params: CreateOrderParams = {
        userId: 'user-1',
        items: mockCartItems,
        total: 449.97,
        paymentData: {
          paymentMethodType: 'pix',
        },
      };

      const order = await repo.create(params);

      expect(addDoc).toHaveBeenCalledWith(
        'orders-col',
        expect.objectContaining({
          userId: 'user-1',
          status: 'pending',
          paymentMethod: { type: 'pix' },
        })
      );
      expect(order.id).toBe('pix-order-1');
      expect(order.paymentMethod).toEqual({ type: 'pix' });
    });
  });

  // ── Create with Boleto ───────────────────────────
  describe('create (boleto)', () => {
    it('creates order with boleto payment method', async () => {
      const mockDocRef = { id: 'boleto-order-1' };
      (addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (collection as jest.Mock).mockReturnValue('orders-col');

      const params: CreateOrderParams = {
        userId: 'user-1',
        items: mockCartItems,
        total: 449.97,
        paymentData: {
          paymentMethodType: 'boleto',
        },
      };

      const order = await repo.create(params);

      expect(addDoc).toHaveBeenCalledWith(
        'orders-col',
        expect.objectContaining({
          userId: 'user-1',
          status: 'pending',
          paymentMethod: { type: 'boleto' },
        })
      );
      expect(order.id).toBe('boleto-order-1');
      expect(order.paymentMethod).toEqual({ type: 'boleto' });
    });
  });

  // ── buildPaymentMethod ───────────────────────────
  describe('buildPaymentMethod', () => {
    const buildPayment = (paymentData: PaymentFormData): PaymentMethod =>
      (repo as unknown as { buildPaymentMethod: (d: PaymentFormData) => PaymentMethod })
        .buildPaymentMethod(paymentData);

    it('builds credit card payment method with last4 and brand', () => {
      const result = buildPayment({
        paymentMethodType: 'credit_card',
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John',
      });

      expect(result).toEqual({
        type: 'credit_card',
        last4: '1111',
        brand: 'Visa',
      });
    });

    it('builds credit card with Mastercard brand', () => {
      const result = buildPayment({
        paymentMethodType: 'credit_card',
        cardNumber: '5500000000000004',
      });

      expect(result).toEqual({
        type: 'credit_card',
        last4: '0004',
        brand: 'Mastercard',
      });
    });

    it('builds pix payment method', () => {
      const result = buildPayment({ paymentMethodType: 'pix' });
      expect(result).toEqual({ type: 'pix' });
    });

    it('builds boleto payment method', () => {
      const result = buildPayment({ paymentMethodType: 'boleto' });
      expect(result).toEqual({ type: 'boleto' });
    });

    it('handles credit card with undefined cardNumber gracefully', () => {
      const result = buildPayment({
        paymentMethodType: 'credit_card',
      });

      expect(result).toEqual({
        type: 'credit_card',
        last4: '',
        brand: 'Cartão de Crédito',
      });
    });
  });

  describe('getCached', () => {
    it('returns cached orders from AsyncStorage', async () => {
      const cachedOrders = [{ id: 'order-1', total: 100 }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(cachedOrders));

      const result = await repo.getCached('user-1');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('cached_orders_user-1');
      expect(result).toEqual(cachedOrders);
    });

    it('returns null when no cached data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await repo.getCached('user-1');
      expect(result).toBeNull();
    });

    it('returns null and reports error on failure', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('fail'));
      const { CrashReport } = require('@/services/analytics');

      const result = await repo.getCached('user-1');
      expect(result).toBeNull();
      expect(CrashReport.recordError).toHaveBeenCalled();
    });
  });

  describe('detectCardBrand', () => {
    // Access private method via unknown cast for testing
    const detectBrand = (cardNumber: string) =>
      (repo as unknown as { detectCardBrand: (n: string) => string }).detectCardBrand(cardNumber);

    it('detects Visa', () => {
      expect(detectBrand('4111111111111111')).toBe('Visa');
      expect(detectBrand('4000 0000 0000 0000')).toBe('Visa');
    });

    it('detects Mastercard', () => {
      expect(detectBrand('5111111111111111')).toBe('Mastercard');
      expect(detectBrand('5500000000000004')).toBe('Mastercard');
    });

    it('detects Amex', () => {
      expect(detectBrand('341111111111111')).toBe('Amex');
      expect(detectBrand('371111111111111')).toBe('Amex');
    });

    it('detects Discover', () => {
      expect(detectBrand('6011111111111111')).toBe('Discover');
      expect(detectBrand('6500000000000000')).toBe('Discover');
    });

    it('detects Elo', () => {
      expect(detectBrand('6363681111111111')).toBe('Elo');
      expect(detectBrand('5067111111111111')).toBe('Elo');
    });

    it('detects Hipercard', () => {
      expect(detectBrand('6062821111111111')).toBe('Hipercard');
    });

    it('returns default for unknown brand', () => {
      expect(detectBrand('9999999999999999')).toBe('Cartão de Crédito');
    });
  });
});
