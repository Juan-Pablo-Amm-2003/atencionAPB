import { useState } from 'react';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (amount: number) => void;
}

const DiscountModal = ({ isOpen, onClose, onApplyDiscount }: DiscountModalProps) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount >= 0) {
      onApplyDiscount(numericAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Aplicar Descuento</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto del descuento"
          className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
        />
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancelar</button>
          <button onClick={handleApply} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Aplicar</button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;
