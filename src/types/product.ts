// =========================================
// src/types/product.ts
// =========================================

// Actualiza tu definición de Product para usar `stock: number` en lugar de `inStock`
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;            // cambiamos aquí
  ingredients?: string[];
  allergens?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;            // cambiamos aquí
  ingredients?: string[];
  allergens?: string[];
}

export type ProductCategory = 'bread' | 'pastry' | 'cake' | 'cookie' | 'dessert';