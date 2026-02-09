export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface PaymentMethod {
  type: 'credit_card';
  last4: string;
  brand: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDoc {
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
}
