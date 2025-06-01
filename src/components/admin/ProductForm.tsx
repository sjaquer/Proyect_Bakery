import React from 'react';
import { Product } from '../../types';

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const categories = [
  { id: 'panes', name: 'Panes' },
  { id: 'bollería', name: 'Bollería' },
  { id: 'dulces', name: 'Dulces' },
  { id: 'salados', name: 'Salados' },
  { id: 'tartas', name: 'Tartas' },
];

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onSubmit, onCancel }) => {
  const [product, setProduct] = React.useState<Product>(
    initialProduct || {
      id: '',
      name: '',
      description: '',
      price: 0,
      category: 'panes',
      imageUrl: '',
      stock: 0,
      isAvailable: true,
    }
  );
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setProduct({
        ...product,
        [name]: parseFloat(value) || 0,
      });
    } else if (type === 'checkbox') {
      setProduct({
        ...product,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!product.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!product.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (product.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (product.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }
    
    if (!product.imageUrl.trim()) {
      newErrors.imageUrl = 'La URL de la imagen es requerida';
    } else if (!isValidUrl(product.imageUrl)) {
      newErrors.imageUrl = 'Ingrese una URL válida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Generate an ID if it's a new product
      if (!product.id) {
        const newProduct = {
          ...product,
          id: `prod-${Date.now().toString().slice(-6)}`,
        };
        onSubmit(newProduct);
      } else {
        onSubmit(product);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {initialProduct ? 'Editar producto' : 'Nuevo producto'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.name ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-error-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría *
          </label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={3}
            className={`w-full p-2 border rounded-md ${
              errors.description ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-error-500 text-sm mt-1">{errors.description}</p>}
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Precio (S/) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            min="0"
            step="0.10"
            className={`w-full p-2 border rounded-md ${
              errors.price ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="text-error-500 text-sm mt-1">{errors.price}</p>}
        </div>
        
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            min="0"
            className={`w-full p-2 border rounded-md ${
              errors.stock ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.stock && <p className="text-error-500 text-sm mt-1">{errors.stock}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL de la imagen *
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.imageUrl ? 'border-error-500' : 'border-gray-300'
            }`}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {errors.imageUrl && <p className="text-error-500 text-sm mt-1">{errors.imageUrl}</p>}
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={product.isAvailable}
              onChange={(e) => setProduct({ ...product, isAvailable: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">
              Producto disponible para la venta
            </label>
          </div>
        </div>
        
        {product.imageUrl && (
          <div className="md:col-span-2 mt-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <div className="h-40 w-40 rounded-md overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt="Vista previa" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg';
                  setErrors({
                    ...errors,
                    imageUrl: 'No se pudo cargar la imagen, verifique la URL',
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800"
        >
          {initialProduct ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;