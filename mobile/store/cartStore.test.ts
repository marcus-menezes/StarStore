import { useCartStore } from './cartStore';
import type { Product } from '@/types';

// Reset store state between tests
beforeEach(() => {
  useCartStore.setState({ items: [], isLoading: false });
});

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Star Wars Lightsaber',
  description: 'A elegant weapon for a more civilized age',
  price: 199.99,
  seller: 'Jedi Temple',
  imageUrl: 'https://example.com/lightsaber.png',
  category: 'weapons',
  stock: 10,
  createdAt: new Date('2024-01-01'),
};

const mockProduct2: Product = {
  id: 'prod-2',
  name: 'Millennium Falcon Model',
  description: 'Fastest ship in the galaxy',
  price: 499.99,
  seller: 'Corellian Engineering',
  imageUrl: 'https://example.com/falcon.png',
  category: 'ships',
  stock: 5,
  createdAt: new Date('2024-01-02'),
};

describe('cartStore', () => {
  describe('addItem', () => {
    it('adds a new product to the cart', () => {
      useCartStore.getState().addItem(mockProduct);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe('prod-1');
      expect(items[0].quantity).toBe(1);
    });

    it('increments quantity when adding an existing product', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it('adds multiple different products', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('removes a product by its id', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);
      useCartStore.getState().removeItem('prod-1');

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe('prod-2');
    });

    it('does nothing when product id is not found', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().removeItem('nonexistent');

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates quantity for a product', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().updateQuantity('prod-1', 5);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(5);
    });

    it('removes item when quantity is set to 0', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().updateQuantity('prod-1', 0);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });

    it('removes item when quantity is negative', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().updateQuantity('prod-1', -1);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('removes all items from the cart', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);
      useCartStore.getState().clearCart();

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });
  });

  describe('getTotal', () => {
    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().getTotal()).toBe(0);
    });

    it('calculates total for single item', () => {
      useCartStore.getState().addItem(mockProduct);
      expect(useCartStore.getState().getTotal()).toBeCloseTo(199.99);
    });

    it('calculates total for multiple items with quantities', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);

      // 199.99 * 2 + 499.99 * 1 = 899.97
      expect(useCartStore.getState().getTotal()).toBeCloseTo(899.97);
    });
  });

  describe('getItemCount', () => {
    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().getItemCount()).toBe(0);
    });

    it('counts total quantity of all items', () => {
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct);
      useCartStore.getState().addItem(mockProduct2);

      // 2 + 1 = 3
      expect(useCartStore.getState().getItemCount()).toBe(3);
    });
  });
});
