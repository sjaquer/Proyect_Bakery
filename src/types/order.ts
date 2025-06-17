export type OrderStatus =
  | 'pending'
  | 'received'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'received',
  'delivered',
  'cancelled',
  'rejected',
];

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  priceUnit: number;
  subtotal: number;
  Product: {
    id: number;
    name: string;
  };
}

export interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  customer: Customer;
  createdAt: string;
  total?: number;
  paymentMethod?: string;
  cashAmount?: number;
  reason?: string;
}

export interface CheckoutData {
  items: {
    productId: string | number;
    quantity: number;
  }[];
  paymentMethod: 'cash' | 'yape';
  cashAmount?: number;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}
