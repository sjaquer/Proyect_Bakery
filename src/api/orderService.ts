import api from './axiosConfig';
import { ENDPOINTS } from './endpoints';
import type { Order, OrderStatus, CheckoutData } from '../types/order';

export const getOrders = () =>
  api.get<Order[]>(`${ENDPOINTS.orders}?expand=user,customerInfo`);

export const getOrderById = (id: string) =>
  api.get<Order>(`${ENDPOINTS.orders}/${id}?expand=user,customerInfo`);

export const getOrdersByUser = (userId: string) =>
  api.get<Order[]>(`${ENDPOINTS.userOrders(userId)}&expand=user,customerInfo`);

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
