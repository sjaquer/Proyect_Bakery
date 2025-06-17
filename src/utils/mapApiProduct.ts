import { Product } from '../types/product';

export function mapApiProduct(apiProduct: any): Product {
  return {
    ...apiProduct,
    inStock: apiProduct.stock > 0,
  } as Product;
}
