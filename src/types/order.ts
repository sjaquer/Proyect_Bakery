export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  // ▶▶▶ Añade esto:
  OrderItems: OrderItem[];
  // Si usas customerInfo:
  customerInfo?: {
    address?: string;
    phone?: string;
    email?: string;
  };
}

export interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'card';
}