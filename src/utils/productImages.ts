import placeholderImage from './placeholder';

const imageMap: Record<string, string> = {
  'Pan Chabata': placeholderImage,
  // Agrega mas productos e imagenes aqui
};

export function getProductImage(name: string): string {
  return imageMap[name] ?? placeholderImage;
}
