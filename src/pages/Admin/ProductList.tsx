// src/pages/Admin/ProductList.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchProducts,
  deleteProduct as deleteProductApi,
} from '../../api/productService';
import Button from '../../components/shared/Button';
import { formatPrice } from '../../utils/formatters';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error cargando productos', err);
      }
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    await deleteProductApi(String(id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Gestión de Productos</h1>
        <Button onClick={() => navigate('/admin/products/create')}>
          + Nuevo Producto
        </Button>
      </div>
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Precio</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{formatPrice(p.price)}</td>
              <td className="px-4 py-2">{p.stock}</td>
              <td className="px-4 py-2 space-x-2">
                <Button size="sm" onClick={() => navigate(`/admin/products/edit/${p.id}`)}>
                  Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
