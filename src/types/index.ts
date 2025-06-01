export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  address?: string;
  orderHistory: Order[];
}

export type PaymentMethod = 'cash' | 'yape' | 'plin';

export interface Payment {
  method: PaymentMethod;
  amount: number;
  changeAmount?: number; // For cash payments
  reference?: string; // For digital payments
}

export type OrderStatus = 'pending' | 'accepted' | 'dispatched' | 'concluded' | 'canceled';

export interface Order {
  id: string;
  customer: {
    name: string;
    whatsapp: string;
    address?: string;
  };
  items: CartItem[];
  status: OrderStatus;
  payment: Payment;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
  }[];
  isDelivery: boolean;
  estimatedTime?: number; // in minutes
  notes?: string;
}

export interface SalesData {
  daily: {
    date: string;
    sales: number;
    orders: number;
  }[];
  weekly: {
    week: string;
    sales: number;
    orders: number;
  }[];
  monthly: {
    month: string;
    sales: number;
    orders: number;
  }[];
}

export interface TopProducts {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
}

export interface TopCustomers {
  customerId: string;
  customerName: string;
  totalOrders: number;
  totalSpent: number;
}

export interface PaymentStats {
  method: PaymentMethod;
  count: number;
  total: number;
  percentage: number;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesData: SalesData;
  topProducts: TopProducts[];
  topCustomers: TopCustomers[];
  paymentStats: PaymentStats[];
}