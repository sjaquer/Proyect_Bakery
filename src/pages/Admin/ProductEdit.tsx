// src/pages/Admin/ProductEdit.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`)
        .then(({ data }) => setForm(data))
        .catch((err) => console.error(err));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, form);
      } else {
        await api.post('/products', form);
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
        <Input
          label="Descripción"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
        />
        <Button type="submit" size="lg">
          Guardar
        </Button>
      </form>
    </div>
  );
};

export default ProductEdit;
