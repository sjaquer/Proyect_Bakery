export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
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
  inStock: boolean;
  ingredients?: string[];
  allergens?: string[];
}

export type ProductCategory = 'bread' | 'pastry' | 'cake' | 'cookie' | 'dessert';