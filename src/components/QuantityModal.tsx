import { useState, useEffect } from 'react';
import type { TicketItem } from '../types';

interface QuantityModalProps {
  item: TicketItem | null;
  onClose: () => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const QuantityModal = ({ item, onClose, onUpdateQuantity, onRemoveItem }: QuantityModalProps) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (item) {
      setInputValue(item.quantity.toString());
    }
  }, [item]);

  if (!item) return null;

  const handleNumberClick = (num: string) => {
    setInputValue((prev) => (prev === '0' || prev === '' ? num : prev + num));
  };

  const handleClear = () => setInputValue('');

  const handleAccept = () => {
    const newQuantity = parseInt(inputValue, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    } else {
      // Si la cantidad es 0 o inválida, se elimina el ítem
      onRemoveItem(item.id);
    }
    onClose();
  };

  const handleIncrement = () => setInputValue((prev) => (parseInt(prev || '0', 10) + 1).toString());
  const handleDecrement = () => setInputValue((prev) => Math.max(1, parseInt(prev || '1', 10) - 1).toString());

  const handleRemove = () => {
    onRemoveItem(item.id);
    onClose();
  }
    
  const currentQuantity = parseInt(inputValue || '0', 10);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-4xl font-bold mb-4 text-center text-blue-800">{item.name}</h2>
        <div className="text-8xl font-black text-center mb-6 p-4 border-4 border-red-500 bg-red-50 rounded-lg">{currentQuantity}</div>

        <div className="flex gap-4 mb-4">
            <button onClick={handleDecrement} className="w-1/2 text-5xl font-bold p-4 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors">-1</button>
            <button onClick={handleIncrement} className="w-1/2 text-5xl font-bold p-4 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors">+1</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[ '7', '8', '9', '4', '5', '6', '1', '2', '3'].map((num) => (
            <button key={num} onClick={() => handleNumberClick(num)} className="text-5xl font-bold p-4 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors">
              {num}
            </button>
          ))}
          <button onClick={handleClear} className="text-4xl font-bold p-4 bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-colors">C</button>
          <button onClick={() => handleNumberClick('0')} className="text-5xl font-bold p-4 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors">0</button>
          <button onClick={handleRemove} className="text-2xl font-bold p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
            ELIMINAR
          </button>
        </div>

        <div className="mt-6 flex justify-between gap-4">
          <button onClick={onClose} className="w-1/2 text-2xl font-bold p-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors">
            CANCELAR
          </button>
          <button onClick={handleAccept} className="w-1/2 text-2xl font-bold p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;