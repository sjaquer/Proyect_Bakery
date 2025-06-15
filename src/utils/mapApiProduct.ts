import { Product } from '../types/product';

export function mapApiProduct(apiProduct: any): Product {
  const imageUrl =
    apiProduct.imageUrl ??
    apiProduct.imageurl ??
    apiProduct.image_url ??
    apiProduct.image ??
    '';

  return {
    ...apiProduct,
    imageUrl,
    inStock: apiProduct.stock > 0,
  } as Product;
}
