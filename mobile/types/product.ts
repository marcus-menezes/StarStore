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

export interface ProductsResponse {
  products: Product[];
  total: number;
}
