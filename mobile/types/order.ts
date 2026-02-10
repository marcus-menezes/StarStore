import type { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

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

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentMethodType = 'credit_card' | 'pix' | 'boleto';

export interface PaymentMethodCard {
  type: 'credit_card';
  last4: string;
  brand: string;
}

export interface PaymentMethodPix {
  type: 'pix';
}

export interface PaymentMethodBoleto {
  type: 'boleto';
}

export type PaymentMethod = PaymentMethodCard | PaymentMethodPix | PaymentMethodBoleto;

export interface PaymentFormData {
  paymentMethodType: PaymentMethodType;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}
