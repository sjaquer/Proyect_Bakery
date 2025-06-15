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
  quantity: number;
  priceUnit: number;
  subtotal: number;
  Product: {
    id: number;
    name: string;
    imageUrl: string;
  };
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
  // Para invitados, el backend puede devolver el Customer creado
  Customer?: {
    id: number;
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
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