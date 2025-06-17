// src/types/product.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  category: string;
  stock: number;    // ← refleja el stock real de la BD
  inStock: boolean; // ← lo calcularemos en el store
  ingredients?: string[];
  allergens?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  category: string;
  stock: number;    // ← formulario de admin debe enviar stock
  ingredients?: string[];
  allergens?: string[];
}
