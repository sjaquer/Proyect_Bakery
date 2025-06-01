import { create } from 'zustand';
import { mockProducts, mockOrders, mockCustomers, mockDashboardStats } from '../data/mock-data';
import { Product, Order, OrderStatus, Customer, CartItem, PaymentMethod, DashboardStats } from '../types';

interface StoreState {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  
  // Checkout
  customerName: string;
  customerWhatsapp: string;
  customerAddress: string;
  isDelivery: boolean;
  paymentMethod: PaymentMethod;
  cashAmount: number;
  setCustomerName: (name: string) => void;
  setCustomerWhatsapp: (whatsapp: string) => void;
  setCustomerAddress: (address: string) => void;
  setIsDelivery: (isDelivery: boolean) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCashAmount: (amount: number) => void;
  
  // Analytics
  dashboardStats: DashboardStats;
  
  // Helper methods
  calculateCartTotal: () => number;
  createNewOrder: () => Order | null;
}

const useStore = create<StoreState>((set, get) => ({
  // Products
  products: mockProducts,
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((product) => 
      product.id === id ? { ...product, ...updates } : product
    ),
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((product) => product.id !== id),
  })),
  
  // Orders
  orders: mockOrders,
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map((order) => {
      if (order.id === id) {
        const statusHistory = [
          ...order.statusHistory,
          { status, timestamp: new Date() },
        ];
        return { 
          ...order, 
          status, 
          statusHistory,
          updatedAt: new Date() 
        };
      }
      return order;
    }),
  })),
  getOrdersByStatus: (status) => {
    return get().orders.filter((order) => order.status === status);
  },
  
  // Cart
  cart: [],
  addToCart: (product, quantity) => set((state) => {
    const existingItem = state.cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      return {
        cart: state.cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      };
    }
    return { cart: [...state.cart, { product, quantity }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.product.id !== productId),
  })),
  updateCartItemQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    ),
  })),
  clearCart: () => set({ cart: [] }),
  
  // Customers
  customers: mockCustomers,
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map((customer) => 
      customer.id === id ? { ...customer, ...updates } : customer
    ),
  })),
  
  // Checkout
  customerName: '',
  customerWhatsapp: '',
  customerAddress: '',
  isDelivery: false,
  paymentMethod: 'cash',
  cashAmount: 0,
  setCustomerName: (name) => set({ customerName: name }),
  setCustomerWhatsapp: (whatsapp) => set({ customerWhatsapp: whatsapp }),
  setCustomerAddress: (address) => set({ customerAddress: address }),
  setIsDelivery: (isDelivery) => set({ isDelivery }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setCashAmount: (amount) => set({ cashAmount: amount }),
  
  // Analytics
  dashboardStats: mockDashboardStats,
  
  // Helper methods
  calculateCartTotal: () => {
    return get().cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },
  createNewOrder: () => {
    const {
      cart,
      customerName,
      customerWhatsapp,
      customerAddress,
      isDelivery,
      paymentMethod,
      cashAmount,
      calculateCartTotal,
    } = get();
    
    if (cart.length === 0 || !customerName || !customerWhatsapp) {
      return null;
    }
    
    const totalAmount = calculateCartTotal();
    
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customer: {
        name: customerName,
        whatsapp: customerWhatsapp,
        address: isDelivery ? customerAddress : undefined,
      },
      items: [...cart],
      status: 'pending',
      payment: {
        method: paymentMethod,
        amount: totalAmount,
        changeAmount: paymentMethod === 'cash' ? cashAmount - totalAmount : undefined,
      },
      totalAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(),
        },
      ],
      isDelivery,
      estimatedTime: isDelivery ? 45 : 30,
    };
    
    return newOrder;
  },
}));

export default useStore;