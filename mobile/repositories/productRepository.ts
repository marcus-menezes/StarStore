import type { Product } from '@/types';
import { collection, doc, getDoc, getDocs, getFirestore } from '@react-native-firebase/firestore';
import type { DocumentSnapshot, QueryDocumentSnapshot } from '@react-native-firebase/firestore';

// Repository interface (Dependency Inversion - depend on abstractions)
export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
}

// Firebase implementation (modular API)
export class ProductRepository implements IProductRepository {
  private readonly collectionName = 'products';

  private get db() {
    return getFirestore();
  }

  async getAll(): Promise<Product[]> {
    const colRef = collection(this.db, this.collectionName);
    const snapshot = await getDocs(colRef);

    return snapshot.docs.map((docSnap) => this.mapDocument(docSnap));
  }

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(this.db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.mapDocument(docSnap);
  }

  private mapDocument(docSnap: QueryDocumentSnapshot | DocumentSnapshot): Product {
    const data = docSnap.data()!;
    return {
      id: docSnap.id,
      name: data.name,
      description: data.description,
      price: data.price,
      seller: data.seller,
      imageUrl: data.imageUrl,
      category: data.category,
      stock: data.stock,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    };
  }
}

// Singleton instance
export const productRepository = new ProductRepository();
