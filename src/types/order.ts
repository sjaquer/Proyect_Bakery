export interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

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
  paymentMethod: string;
  cashAmount?: number;
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
  items: {
    productId: string | number;
    quantity: number;
    priceUnit: number;
    subtotal: number;
  }[];
  paymentMethod: 'cash' | 'yape';
  total: number;
  cashAmount?: number;
  customerId?: number;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}