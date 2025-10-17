import { useState, useEffect } from 'react';
import type { Product } from '../types';

interface WeightModalProps {
  product: Product | null;
  onClose: () => void;
  onAddItem: (productId: number, weight: number) => void;
}

const WeightModal = ({ product, onClose, onAddItem }: WeightModalProps) => {
  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (product) {
      setWeight(''); // Reset weight when a new product is selected
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    const numericWeight = parseFloat(weight);
    if (!isNaN(numericWeight) && numericWeight > 0) {
      onAddItem(product.id, numericWeight);
      onClose();
    }
  };

  const totalPrice = (parseFloat(weight) || 0) * product.price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold mb-2">Venta por Peso</h2>
        <p className="text-xl mb-6 text-gray-600">Producto: <span className='font-bold'>{product.name}</span></p>
        
        <div className='mb-6'>
          <label htmlFor='weight-input' className='text-lg font-medium text-gray-700 block mb-2'>Peso (kg)</label>
          <input
            id='weight-input'
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ej: 1.25"
            autoFocus
            className="w-full p-4 text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className='text-center mb-6 bg-gray-100 p-4 rounded-lg'>
            <p className='text-lg text-gray-600'>Precio Total Calculado</p>
            <p className='text-5xl font-black text-green-600'>${totalPrice.toFixed(2)}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition">
            Cancelar
          </button>
          <button onClick={handleAdd} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400" disabled={!parseFloat(weight) || parseFloat(weight) <= 0}>
            Añadir al Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightModal;
