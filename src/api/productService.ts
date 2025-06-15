import api from './axiosConfig';
import { ProductFormData, Product } from '../types/product';

export const fetchProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/products');
  return data;
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
  const { data: created } = await api.post('/products', data);
  return created;
};

export const updateProduct = async (
  id: string,
  data: ProductFormData
): Promise<Product> => {
  const { data: updated } = await api.put(`/products/${id}`, data);
  return updated;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
