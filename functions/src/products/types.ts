export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  seller: string;
  imageUrl: string;
  category?: string;
  stock?: number;
  createdAt: Date;
}

export interface ProductDoc {
  name: string;
  description: string;
  price: number;
  seller: string;
  imageUrl: string;
  category?: string;
  stock?: number;
  createdAt: FirebaseFirestore.Timestamp;
}
