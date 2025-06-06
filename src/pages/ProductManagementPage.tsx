// src/pages/ProductManagementPage.tsx

import React, { useEffect, useState } from 'react';
import { useStore, Product } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const ProductManagementPage: React.FC = () => {
  const user = useStore(state => state.user);
  const navigate = useNavigate();

  // Métodos y estado del store
  const products = useStore(state => state.products);
  const fetchProducts = useStore(state => state.fetchProducts);
  const createProduct = useStore(state => state.createProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const deleteProduct = useStore(state => state.deleteProduct);

  // Estado local para el formulario de creación
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newStock, setNewStock] = useState<number>(0);
  const [newCategory, setNewCategory] = useState('bread');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Estado para edición inline: un mapa { productId: { campos editados } }
  const [editing, setEditing] = useState<{
    [key: number]: {
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      imageUrl: string;
    };
  }>({});

  // Validar rol admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [user, navigate, fetchProducts]);

  // Manejar creación de nuevo producto
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({
        name: newName,
        description: newDescription,
        price: newPrice,
        stock: newStock,
        category: newCategory,
        imageUrl: newImageUrl,
      });
      // Limpiar formulario
      setNewName('');
      setNewDescription('');
      setNewPrice(0);
      setNewStock(0);
      setNewCategory('bread');
      setNewImageUrl('');
    } catch (error) {
      console.error('Error creando producto:', error);
      alert('No se pudo crear el producto. Revisa la consola.');
    }
  };

  // Iniciar edición inline para un producto
  const startEditing = (prod: Product) => {
    setEditing((prev) => ({
      ...prev,
      [prod.id]: {
        name: prod.name,
        description: prod.description,
        price: typeof prod.price === 'string' ? parseFloat(prod.price) : prod.price,
        stock: prod.stock,
        category: prod.category,
        imageUrl: prod.imageUrl,
      },
    }));
  };

  // Cancelar edición
  const cancelEditing = (id: number) => {
    setEditing((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Guardar cambios tras edición inline
  const saveEditing = async (id: number) => {
    const data = editing[id];
    if (!data) return;
    try {
      await updateProduct(id, {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: data.category,
        imageUrl: data.imageUrl,
      });
      cancelEditing(id);
    } catch (error) {
      console.error('Error actualizando producto:', error);
      alert('No se pudo actualizar. Revisa la consola.');
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('No se pudo eliminar. Revisa la consola.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Productos</h2>

      {/* Formulario de creación */}
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-2">Agregar Producto Nuevo</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Nombre*</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Descripción*</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Precio*</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newPrice}
              onChange={(e) => setNewPrice(parseFloat(e.target.value))}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Stock*</label>
            <input
              type="number"
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Categoría*</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="bread">Bread</option>
              <option value="sweet">Sweet</option>
              <option value="special">Special</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">URL de Imagen</label>
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </section>

      {/* Tabla de productos */}
      <section>
        <h3 className="text-xl font-medium mb-2">Listado de Productos</h3>
        {products.length === 0 ? (
          <p>No hay productos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2">ID</th>
                  <th className="border px-3 py-2">Nombre</th>
                  <th className="border px-3 py-2">Descripción</th>
                  <th className="border px-3 py-2">Precio</th>
                  <th className="border px-3 py-2">Stock</th>
                  <th className="border px-3 py-2">Categoría</th>
                  <th className="border px-3 py-2">Imagen</th>
                  <th className="border px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => {
                  const isEditing = Boolean(editing[prod.id]);
                  const editValues = editing[prod.id];

                  return (
                    <tr key={prod.id}>
                      <td className="border px-3 py-2">{prod.id}</td>

                      {/* Columna Nombre */}
                      <td className="border px-3 py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.name}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [prod.id]: {
                                  ...prev[prod.id],
                                  name: e.target.value,
                                },
                              }))
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          prod.name
                        )}
                      </td>

                      {/* Columna Descripción */}
                      <td className="border px-3 py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.description}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [prod.id]: {
                                  ...prev[prod.id],
                                  description: e.target.value,
                                },
                              }))
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          prod.description
                        )}
                      </td>

                      {/* Columna Precio */}
                      <td className="border px-3 py-2">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editValues.price}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [prod.id]: {
                                  ...prev[prod.id],
                                  price: parseFloat(e.target.value),
                                },
                              }))
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          `$${prod.price}`
                        )}
                      </td>

                      {/* Columna Stock */}
                      <td className="border px-3 py-2">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            value={editValues.stock}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [prod.id]: {
                                  ...prev[prod.id],
                                  stock: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          prod.stock
                        )}
                      </td>

                      {/* Columna Categoría */}
                      <td className="border px-3 py-2">
                        {isEditing ? (
                          <select
                            value={editValues.category}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [prod.id]: {
                                  ...prev[prod.id],
                                  category: e.target.value,
                                },
                              }))
                            }
                            className="border p-1 rounded w-full"
                          >
                            <option value="bread">Bread</option>
                            <option value="sweet">Sweet</option>
                            <option value="special">Special</option>
                          </select>
                        ) : (
                          prod.category
                        )}
                      </td>

                      {/* Columna URL de Imagen */}
                      <td className="border px-3 py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.imageUrl}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [prod.id]: {
                                  ...prev[prod.id],
                                  imageUrl: e.target.value,
                                },
                              }))
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          prod.imageUrl || '-'
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="border px-3 py-2 space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEditing(prod.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => cancelEditing(prod.id)}
                              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(prod)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductManagementPage;
