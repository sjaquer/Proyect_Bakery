import api from './axiosConfig';
import { ENDPOINTS } from './endpoints';
import type { Customer } from '../types/order';

export const getUserProfile = () => api.get<Customer>(ENDPOINTS.userProfile);

export const updateUserProfile = (data: {
  name: string;
  email: string;
  phone: string;
  address: string;
}) => api.put<Customer>(ENDPOINTS.userProfile, data);
