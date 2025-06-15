import React, { useState } from 'react';
import { ProductFormData } from '../../types/product';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

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
    price: initialData?.price || 0,
    category: initialData?.category || 'bread',
    imageUrl: initialData?.imageUrl || '',
    stock: initialData?.stock ?? 0,
    ingredients: initialData?.ingredients || [],
    allergens: initialData?.allergens || [],
  });

  const [previewFit, setPreviewFit] = useState<'cover' | 'contain'>('cover');

  const [ingredientsText, setIngredientsText] = useState(
    initialData?.ingredients?.join(', ') || ''
  );
  const [allergensText, setAllergensText] = useState(
    initialData?.allergens?.join(', ') || ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const ingredients = ingredientsText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    const allergens = allergensText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    await onSubmit({
      ...formData,
      ingredients,
      allergens,
    });
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
        label="URL de imagen"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleInputChange}
        required
      />

      {/* Image preview and fit options */}
      {formData.imageUrl && (
        <div className="space-y-2">
          <div className="w-full h-48 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
            <img
              src={resolveImageUrl(formData.imageUrl)}
              alt="Vista previa"
              className={`w-full h-full object-${previewFit}`}
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'https://via.placeholder.com/300?text=Imagen+no+disponible';
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ajuste de imagen
            </label>
            <select
              value={previewFit}
              onChange={(e) => setPreviewFit(e.target.value as 'cover' | 'contain')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="cover">Recortar (cover)</option>
              <option value="contain">Contener (contain)</option>
            </select>
          </div>
        </div>
      )}

      <Input
        label="Ingredientes (separados por coma)"
        value={ingredientsText}
        onChange={(e) => setIngredientsText(e.target.value)}
        helperText="Introduce los ingredientes separados por comas"
      />

      <Input
        label="Alérgenos (separados por coma)"
        value={allergensText}
        onChange={(e) => setAllergensText(e.target.value)}
        helperText="Introduce los alérgenos separados por comas"
      />


      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;