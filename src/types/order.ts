export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'card';
}