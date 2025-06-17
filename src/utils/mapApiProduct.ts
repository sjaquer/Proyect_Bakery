import { Product } from '../types/product';

export function mapApiProduct(apiProduct: any): Product {
  return {
    ...apiProduct,
    imageUrl: apiProduct.imageUrl ?? apiProduct.image_url ?? '',
    inStock: apiProduct.stock > 0,
  } as Product;
}
