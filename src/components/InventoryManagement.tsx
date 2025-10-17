import { useState, useEffect } from 'react';
import { getProducts, getCategories, updateProductData, createProduct, createCategory, deleteProduct, updateCategory, deleteCategory } from '../services/apiService';
import type { Product, Category } from '../types';
import type { NewProduct } from '../services/apiService';
import type { ToastType } from './ToastNotification';
import NewProductModal from './NewProductModal';

interface InventoryManagementProps {
  showToast: (message: string, type: ToastType) => void;
}

const InventoryManagement = ({ showToast }: InventoryManagementProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategoryId === null || product.categoryId === filterCategoryId;
    const matchesSearch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    } catch (error) {
      showToast('Error al cargar el inventario.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (product: Product, field: 'price' | 'currentStock', value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      showToast('El valor debe ser un número positivo.', 'error');
      return;
    }

    const updatedProduct = { ...product, [field]: numericValue };
    setEditingId(product.id);

    try {
      await updateProductData(updatedProduct);
      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
      showToast('Producto actualizado con éxito', 'success');
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
    } finally {
      setEditingId(null);
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.name || 'N/A';
  };

  const handleCreateProduct = async (productData: NewProduct) => {
    try {
      const newProduct = await createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      showToast('Producto creado con éxito', 'success');
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) showToast(error.message, 'error');
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast('El nombre de la categoría no puede estar vacío.', 'error');
      return;
    }
    try {
      const newCategory = await createCategory(newCategoryName);
      setCategories(prev => [...prev, newCategory]);
      showToast('Categoría creada con éxito', 'success');
      setNewCategoryName('');
    } catch (error) {
      if (error instanceof Error) showToast(error.message, 'error');
    }
  };

  const handleUpdateCategory = async (categoryId: number) => {
    if (!editingCategoryName.trim()) {
      showToast('El nombre de la categoría no puede estar vacío.', 'error');
      return;
    }
    try {
      const updatedCategory = await updateCategory(categoryId, editingCategoryName);
      setCategories(prev => prev.map(c => c.id === categoryId ? updatedCategory : c));
      showToast('Categoría actualizada con éxito', 'success');
      setEditingCategoryId(null);
      setEditingCategoryName('');
    } catch (error) {
      if (error instanceof Error) showToast(error.message, 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta categoría? Esto no será posible si hay productos asociados a ella.')) {
      try {
        await deleteCategory(categoryId);
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        showToast('Categoría eliminada con éxito', 'success');
      } catch (error) {
        if (error instanceof Error) showToast(error.message, 'error');
      }
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        showToast('Producto eliminado con éxito', 'success');
      } catch (error) {
        if (error instanceof Error) showToast(error.message, 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gestión de Inventario</h2>
        <p>Cargando datos del inventario...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Gestión de Inventario</h2>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Agregar Producto</button>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-bold mb-2">Crear Nueva Categoría</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nombre de la categoría"
                className="flex-grow p-2 border rounded-md"
              />
              <button onClick={handleCreateCategory} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Guardar</button>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-bold mb-2">Gestionar Categorías Existentes</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.id} className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
                  {editingCategoryId === cat.id ? (
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="flex-grow p-1 border rounded-md"
                      onBlur={() => handleUpdateCategory(cat.id)}
                      aria-label={`Nuevo nombre para ${editingCategoryName}`}
                    />
                  ) : (
                    <span>{cat.name}</span>
                  )}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setEditingCategoryId(cat.id);
                        setEditingCategoryName(cat.name);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)} 
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border rounded-md"
          />
          <select
            aria-label="Filtrar por categoría"
            value={filterCategoryId ?? ''}
            onChange={(e) => setFilterCategoryId(e.target.value ? Number(e.target.value) : null)}
            className="p-2 border rounded-md bg-white"
          >
            <option value="">Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left font-bold">Nombre</th>
                <th className="py-3 px-4 text-left font-bold">Categoría</th>
                <th className="py-3 px-4 text-right font-bold">Precio</th>
                <th className="py-3 px-4 text-right font-bold">Stock</th>
                <th className="py-3 px-4 text-left font-bold">Tipo</th>
                <th className="py-3 px-4 text-center font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-100 transition-colors">
                  <td className="py-2 px-4 font-medium">{product.name}</td>
                  <td className="py-2 px-4">{getCategoryName(product.categoryId)}</td>
                  <td className="py-2 px-4">
                    <input 
                      type="number"
                      defaultValue={product.price.toFixed(2)}
                      onBlur={(e) => handleUpdate(product, 'price', e.target.value)}
                      disabled={editingId === product.id}
                      className="w-24 p-1 border rounded text-right focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                      aria-label={`Precio de ${product.name}`}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input 
                      type="number"
                      defaultValue={product.currentStock}
                      onBlur={(e) => handleUpdate(product, 'currentStock', e.target.value)}
                      disabled={editingId === product.id}
                      className="w-24 p-1 border rounded text-right focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                      aria-label={`Stock de ${product.name}`}
                    />
                  </td>
                  <td className="py-2 px-4">{product.isWeightProduct ? 'Peso' : 'Unidad'}</td>
                  <td className="py-2 px-4 text-center">
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800" title={`Eliminar ${product.name}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <NewProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onCreate={handleCreateProduct} 
          categories={categories} 
          showToast={showToast}
        />
      )}
    </>
  );
};

export default InventoryManagement;
