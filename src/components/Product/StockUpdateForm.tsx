import React, { useState } from 'react';
import { Product } from '../../types/product';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface StockUpdateFormProps {
  products: Product[];
  onSubmit: (updates: { id: string; stock: number }[]) => Promise<void>;
  isLoading?: boolean;
}

const StockUpdateForm: React.FC<StockUpdateFormProps> = ({ products, onSubmit, isLoading = false }) => {
  const [stockValues, setStockValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    products.forEach(p => {
      initial[p.id] = p.stock;
    });
    return initial;
  });

  const handleChange = (id: string, value: number) => {
    setStockValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updates = products.map(p => ({ id: p.id, stock: stockValues[p.id] }));
    await onSubmit(updates);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {products.map(product => (
        <div key={product.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {product.name}
          </label>
          <Input
            type="number"
            value={stockValues[product.id]}
            onChange={(e) => handleChange(product.id, Number(e.target.value))}
          />
        </div>
      ))}
      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};

export default StockUpdateForm;
