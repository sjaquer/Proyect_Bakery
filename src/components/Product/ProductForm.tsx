import React, { useState } from 'react';
import { ProductFormData } from '../../types/product';
import Input from '../shared/Input';
import Button from '../shared/Button';
import ImageEditor from '../shared/ImageEditor';

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  submitLabel = 'Guardar producto',
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    price: initialData?.price || 0,
    category: initialData?.category || 'bread',
    stock: initialData?.stock ?? 0,
    ingredients: initialData?.ingredients || [],
    allergens: initialData?.allergens || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Precio (S/)"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
        >
          <option value="bread">Pan</option>
          <option value="pastry">Pastel</option>
          <option value="cake">Torta</option>
          <option value="cookie">Galleta</option>
          <option value="dessert">Postre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
        />
      </div>

      <Input
        label="Imagen URL"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleInputChange}
        helperText="Opcional: enlace a la imagen del producto"
      />

      {formData.imageUrl && (
        <>
          <ImageEditor
            imageUrl={formData.imageUrl}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, imageUrl: url }))
            }
          />
          <img
            src={formData.imageUrl}
            alt="Vista previa"
            className="mt-4 h-32 w-32 object-cover rounded"
          />
        </>
      )}


      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
