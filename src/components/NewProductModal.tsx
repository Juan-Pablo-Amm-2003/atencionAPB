import { useState } from 'react';
import type { Category } from '../types';
import type { NewProduct } from '../services/apiService';
import type { ToastType } from './ToastNotification';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (productData: NewProduct) => Promise<void>;
  categories: Category[];
  showToast: (message: string, type: ToastType) => void;
}

const NewProductModal = ({ isOpen, onClose, onCreate, categories, showToast }: NewProductModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>(categories.length > 0 ? categories[0].id : '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = async () => {
    setIsUploading(true);
    // Simula una subida de 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    const placeholderUrl = `/images/new-product-${Date.now()}.jpg`;
    setImageUrl(placeholderUrl);
    setIsUploading(false);
    showToast('Imagen cargada correctamente (simulado)', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !categoryId || !imageUrl) {
      // Aquí podrías usar un toast para notificar al usuario
      alert('Por favor, complete todos los campos.');
      return;
    }

    const productData: NewProduct = {
      name,
      price: parseFloat(price),
      currentStock: parseInt(stock, 10),
      categoryId: categoryId,
      imageUrl,
      isWeightProduct: false, // Por ahora, asumimos que no se crean productos por peso desde aquí
    };

    setIsSaving(true);
    await onCreate(productData);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Inicial</label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                id="imageUrl-display"
                type="text"
                value={imageUrl}
                readOnly
                placeholder="URL de la imagen aparecerá aquí"
                className="flex-grow p-2 border border-gray-300 rounded-md bg-gray-100"
              />
              <label htmlFor="file-upload" className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${isUploading ? 'opacity-50' : ''}`}>
                <span>{isUploading ? 'Cargando...' : 'Subir Imagen'}</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Seleccione una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors" disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductModal;
