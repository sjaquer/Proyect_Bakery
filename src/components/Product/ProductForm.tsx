import React, { useState } from 'react';
import { ProductFormData } from '../../types/product';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  submitLabel = 'Save Product',
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || 'bread',
    imageUrl: initialData?.imageUrl || '',
    inStock: initialData?.inStock ?? true,
    ingredients: initialData?.ingredients || [],
    allergens: initialData?.allergens || [],
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
        >
          <option value="bread">Bread</option>
          <option value="pastry">Pastry</option>
          <option value="cake">Cake</option>
          <option value="cookie">Cookie</option>
          <option value="dessert">Dessert</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
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
        label="Image URL"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleInputChange}
        required
      />

      <Input
        label="Ingredients (comma-separated)"
        value={ingredientsText}
        onChange={(e) => setIngredientsText(e.target.value)}
        helperText="Enter ingredients separated by commas"
      />

      <Input
        label="Allergens (comma-separated)"
        value={allergensText}
        onChange={(e) => setAllergensText(e.target.value)}
        helperText="Enter allergens separated by commas"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          name="inStock"
          id="inStock"
          checked={formData.inStock}
          onChange={handleInputChange}
          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
        />
        <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
          In Stock
        </label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;