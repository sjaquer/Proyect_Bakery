import api from './axiosConfig';
import { ENDPOINTS } from './endpoints';
import type { Order, OrderStatus, CheckoutData } from '../types/order';

export const getOrders = () =>
  api.get<Order[]>(`${ENDPOINTS.orders}?expand=customer`);

export const getOrderById = (id: string) =>
  api.get<Order>(`${ENDPOINTS.orders}/${id}?expand=customer`);

export const getOrdersByCustomer = (customerId: string) =>
  api.get<Order[]>(`${ENDPOINTS.customerOrders(customerId)}&expand=customer`);

export const createOrder = (data: CheckoutData) =>
  api.post<Order>(ENDPOINTS.orders, data);

export const deleteOrder = (id: string) =>
  api.delete(`${ENDPOINTS.orders}/${id}`);

export const updateOrderStatus = (
  orderId: string,
  status: OrderStatus,
  reason?: string
) =>
  api.put(
    `${ENDPOINTS.orderStatus(orderId)}`,
    reason ? { status, reason } : { status }
  );
