import { collection, doc, getDoc, getDocs } from '@react-native-firebase/firestore';
import { ProductRepository } from './productRepository';

let repo: ProductRepository;

beforeEach(() => {
  jest.clearAllMocks();
  repo = new ProductRepository();
});

const makeMockDocSnap = (id: string, data: Record<string, unknown>) => ({
  id,
  exists: () => true,
  data: () => data,
});

const mockProductData = {
  name: 'Lightsaber',
  description: 'Elegant weapon',
  price: 199.99,
  seller: 'Jedi Temple',
  imageUrl: 'https://example.com/saber.png',
  category: 'weapons',
  stock: 10,
  createdAt: { toDate: () => new Date('2024-01-01') },
};

describe('ProductRepository', () => {
  describe('getAll', () => {
    it('returns all products mapped from Firestore documents', async () => {
      const mockDocs = [
        makeMockDocSnap('prod-1', mockProductData),
        makeMockDocSnap('prod-2', {
          ...mockProductData,
          name: 'Blaster',
          price: 49.99,
        }),
      ];

      (collection as jest.Mock).mockReturnValue('products-col');
      (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

      const products = await repo.getAll();

      expect(collection).toHaveBeenCalled();
      expect(products).toHaveLength(2);
      expect(products[0]).toEqual(
        expect.objectContaining({
          id: 'prod-1',
          name: 'Lightsaber',
          price: 199.99,
        })
      );
      expect(products[1].name).toBe('Blaster');
    });

    it('returns empty array when no products exist', async () => {
      (collection as jest.Mock).mockReturnValue('col');
      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

      const products = await repo.getAll();
      expect(products).toEqual([]);
    });
  });

  describe('getById', () => {
    it('returns product when document exists', async () => {
      const mockDocSnap = makeMockDocSnap('prod-1', mockProductData);
      (doc as jest.Mock).mockReturnValue('doc-ref');
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const product = await repo.getById('prod-1');

      expect(doc).toHaveBeenCalled();
      expect(product).not.toBeNull();
      expect(product!.id).toBe('prod-1');
      expect(product!.name).toBe('Lightsaber');
      expect(product!.price).toBe(199.99);
    });

    it('returns null when document does not exist', async () => {
      const mockDocSnap = {
        id: 'prod-999',
        exists: () => false,
        data: () => null,
      };
      (doc as jest.Mock).mockReturnValue('doc-ref');
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const product = await repo.getById('prod-999');
      expect(product).toBeNull();
    });

    it('handles products without createdAt timestamp', async () => {
      const dataWithoutCreatedAt = {
        ...mockProductData,
        createdAt: null,
      };
      const mockDocSnap = makeMockDocSnap('prod-1', dataWithoutCreatedAt);
      (doc as jest.Mock).mockReturnValue('doc-ref');
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const product = await repo.getById('prod-1');
      expect(product).not.toBeNull();
      expect(product!.createdAt).toBeInstanceOf(Date);
    });
  });
});
