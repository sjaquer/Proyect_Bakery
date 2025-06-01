import { Customer, Order, Product, DashboardStats } from '../types';
import { addDays, subDays, format } from 'date-fns';

// Helper function to generate dates
const generateDates = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    return subDays(new Date(), days - i - 1);
  });
};

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pan Francés',
    description: 'Tradicional pan francés, crujiente por fuera y suave por dentro.',
    price: 0.5,
    category: 'panes',
    imageUrl: 'https://images.pexels.com/photos/1387075/pexels-photo-1387075.jpeg',
    stock: 100,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Croissant',
    description: 'Croissant de mantequilla, con textura hojaldrada y sabor delicado.',
    price: 2.5,
    category: 'bollería',
    imageUrl: 'https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg',
    stock: 30,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Empanada de Carne',
    description: 'Empanada horneada rellena de carne sazonada con cebolla y especias.',
    price: 3.0,
    category: 'salados',
    imageUrl: 'https://images.pexels.com/photos/6941026/pexels-photo-6941026.jpeg',
    stock: 25,
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Tarta de Manzana',
    description: 'Tarta casera de manzana con canela, servida con una capa de azúcar glass.',
    price: 15.0,
    category: 'tartas',
    imageUrl: 'https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg',
    stock: 10,
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Pan de Centeno',
    description: 'Pan de centeno, denso y nutritivo, perfecto para acompañar sopas.',
    price: 4.0,
    category: 'panes',
    imageUrl: 'https://images.pexels.com/photos/1756062/pexels-photo-1756062.jpeg',
    stock: 15,
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Donut Glaseado',
    description: 'Donut esponjoso cubierto de glaseado de azúcar con sprinkles de colores.',
    price: 2.0,
    category: 'dulces',
    imageUrl: 'https://images.pexels.com/photos/2955820/pexels-photo-2955820.jpeg',
    stock: 40,
    isAvailable: true,
  },
  {
    id: '7',
    name: 'Baguette',
    description: 'Baguette tradicional francesa, crujiente y de miga suave.',
    price: 3.5,
    category: 'panes',
    imageUrl: 'https://images.pexels.com/photos/137103/pexels-photo-137103.jpeg',
    stock: 20,
    isAvailable: true,
  },
  {
    id: '8',
    name: 'Cheesecake',
    description: 'Tarta de queso cremosa con base de galleta y cobertura de frutos rojos.',
    price: 18.0,
    category: 'tartas',
    imageUrl: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    stock: 8,
    isAvailable: true,
  },
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'María García',
    whatsapp: '+51987654321',
    address: 'Av. Arequipa 123, Lima',
    orderHistory: [],
  },
  {
    id: '2',
    name: 'Juan Pérez',
    whatsapp: '+51976543210',
    address: 'Jr. Huallaga 456, Lima',
    orderHistory: [],
  },
  {
    id: '3',
    name: 'Ana López',
    whatsapp: '+51965432109',
    orderHistory: [],
  },
  {
    id: '4',
    name: 'Carlos Rodríguez',
    whatsapp: '+51954321098',
    address: 'Av. La Marina 789, Lima',
    orderHistory: [],
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: '1',
    customer: {
      name: 'María García',
      whatsapp: '+51987654321',
      address: 'Av. Arequipa 123, Lima',
    },
    items: [
      { product: mockProducts[0], quantity: 5 },
      { product: mockProducts[3], quantity: 1 },
    ],
    status: 'pending',
    payment: {
      method: 'cash',
      amount: 17.5,
      changeAmount: 2.5,
    },
    totalAmount: 17.5,
    createdAt: new Date(),
    updatedAt: new Date(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(),
      },
    ],
    isDelivery: true,
    estimatedTime: 30,
  },
  {
    id: '2',
    customer: {
      name: 'Juan Pérez',
      whatsapp: '+51976543210',
    },
    items: [
      { product: mockProducts[1], quantity: 2 },
      { product: mockProducts[5], quantity: 3 },
    ],
    status: 'accepted',
    payment: {
      method: 'yape',
      amount: 11.0,
      reference: 'YP123456',
    },
    totalAmount: 11.0,
    createdAt: subDays(new Date(), 1),
    updatedAt: subDays(new Date(), 1),
    statusHistory: [
      {
        status: 'pending',
        timestamp: subDays(new Date(), 1),
      },
      {
        status: 'accepted',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
      },
    ],
    isDelivery: false,
  },
  {
    id: '3',
    customer: {
      name: 'Ana López',
      whatsapp: '+51965432109',
    },
    items: [
      { product: mockProducts[7], quantity: 1 },
    ],
    status: 'dispatched',
    payment: {
      method: 'plin',
      amount: 18.0,
      reference: 'PL789012',
    },
    totalAmount: 18.0,
    createdAt: subDays(new Date(), 2),
    updatedAt: new Date(new Date().setHours(new Date().getHours() - 5)),
    statusHistory: [
      {
        status: 'pending',
        timestamp: subDays(new Date(), 2),
      },
      {
        status: 'accepted',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 6)),
      },
      {
        status: 'dispatched',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 5)),
      },
    ],
    isDelivery: true,
    estimatedTime: 45,
  },
  {
    id: '4',
    customer: {
      name: 'Carlos Rodríguez',
      whatsapp: '+51954321098',
      address: 'Av. La Marina 789, Lima',
    },
    items: [
      { product: mockProducts[2], quantity: 2 },
      { product: mockProducts[6], quantity: 1 },
    ],
    status: 'concluded',
    payment: {
      method: 'cash',
      amount: 10.0,
      changeAmount: 0,
    },
    totalAmount: 9.5,
    createdAt: subDays(new Date(), 3),
    updatedAt: subDays(new Date(), 3),
    statusHistory: [
      {
        status: 'pending',
        timestamp: subDays(new Date(), 3),
      },
      {
        status: 'accepted',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 30)),
      },
      {
        status: 'dispatched',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 29)),
      },
      {
        status: 'concluded',
        timestamp: new Date(new Date().setHours(new Date().getHours() - 28)),
      },
    ],
    isDelivery: true,
    estimatedTime: 30,
  },
];

// Mock Dashboard Stats
const last30Days = generateDates(30);
const dailySales = last30Days.map((date) => ({
  date: format(date, 'yyyy-MM-dd'),
  sales: Math.round(Math.random() * 500 + 200),
  orders: Math.round(Math.random() * 50 + 10),
}));

const last12Weeks = Array.from({ length: 12 }).map((_, i) => {
  const date = subDays(new Date(), i * 7);
  return {
    week: `Week ${format(date, 'w')}`,
    sales: Math.round(Math.random() * 3000 + 1000),
    orders: Math.round(Math.random() * 300 + 70),
  };
});

const last6Months = Array.from({ length: 6 }).map((_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  return {
    month: format(date, 'MMM yyyy'),
    sales: Math.round(Math.random() * 12000 + 5000),
    orders: Math.round(Math.random() * 1200 + 300),
  };
});

export const mockDashboardStats: DashboardStats = {
  totalSales: 95680,
  totalOrders: 1245,
  averageOrderValue: 76.85,
  salesData: {
    daily: dailySales,
    weekly: last12Weeks,
    monthly: last6Months,
  },
  topProducts: [
    {
      productId: '1',
      productName: 'Pan Francés',
      totalSold: 1240,
      revenue: 620,
    },
    {
      productId: '2',
      productName: 'Croissant',
      totalSold: 860,
      revenue: 2150,
    },
    {
      productId: '4',
      productName: 'Tarta de Manzana',
      totalSold: 125,
      revenue: 1875,
    },
    {
      productId: '6',
      productName: 'Donut Glaseado',
      totalSold: 720,
      revenue: 1440,
    },
    {
      productId: '8',
      productName: 'Cheesecake',
      totalSold: 95,
      revenue: 1710,
    },
  ],
  topCustomers: [
    {
      customerId: '1',
      customerName: 'María García',
      totalOrders: 24,
      totalSpent: 1250,
    },
    {
      customerId: '2',
      customerName: 'Juan Pérez',
      totalOrders: 18,
      totalSpent: 980,
    },
    {
      customerId: '3',
      customerName: 'Ana López',
      totalOrders: 15,
      totalSpent: 1120,
    },
    {
      customerId: '4',
      customerName: 'Carlos Rodríguez',
      totalOrders: 12,
      totalSpent: 850,
    },
  ],
  paymentStats: [
    {
      method: 'cash',
      count: 620,
      total: 45400,
      percentage: 47.5,
    },
    {
      method: 'yape',
      count: 425,
      total: 32580,
      percentage: 34.1,
    },
    {
      method: 'plin',
      count: 200,
      total: 17700,
      percentage: 18.4,
    },
  ],
};