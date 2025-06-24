// src/pages/Admin/ProductEdit.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchProduct,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
} from '../../api/productService';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import ImageEditor from '../../components/shared/ImageEditor';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    imageUrl: '',
    featured: false,
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchProduct(id)
        .then((data) =>
          setForm({
            name: data.name,
            price: data.price,
            stock: data.stock,
            description: data.description,
            imageUrl: data.imageUrl || '',
            featured: data.featured || false,
          })
        )
        .catch((err) => console.error(err));
    }
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((f) => ({
      ...f,
      [name]:
        name === 'price' || name === 'stock'
          ? Number(value)
          : type === 'checkbox'
            ? checked
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateProductApi(id, form);
      } else {
        await createProductApi(form);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Error guardando producto', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Precio"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <Input
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4 text-amber-600 border-gray-300 rounded" />
          <span>Destacado del día</span>
        </label>
        <Input
          label="Descripción"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
        />
        <Input
          label="Imagen URL"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          helperText="Opcional"
        />
        {form.imageUrl && (
          <ImageEditor
            imageUrl={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          />
        )}
        <Button type="submit" size="lg">
          Guardar
        </Button>
      </form>
    </div>
  );
};

export default ProductEdit;
