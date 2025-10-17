import { useState, useMemo, useEffect } from 'react';
import { getCashoutData, finalizeCashout } from '../services/apiService';

interface CashoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const denominations = [
  { value: 2000, label: '$2000' },
  { value: 1000, label: '$1000' },
  { value: 500, label: '$500' },
  { value: 200, label: '$200' },
  { value: 100, label: '$100' },
  { value: 50, label: '$50' },
  { value: 20, label: '$20' },
  { value: 10, label: '$10' },
];

const CashoutModal = ({ isOpen, onClose }: CashoutModalProps) => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [expectedCash, setExpectedCash] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getCashoutData()
        .then(setExpectedCash)
        .catch(err => console.error(err)) // En un futuro, usar showToast
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const countedTotal = useMemo(() => {
    return denominations.reduce((total, den) => {
      return total + (counts[den.value] || 0) * den.value;
    }, 0);
  }, [counts]);

  const difference = expectedCash !== null ? countedTotal - expectedCash : 0;

  if (!isOpen) return null;

  const handleCountChange = (value: number, count: string) => {
    const numericCount = parseInt(count, 10);
    setCounts(prev => ({
      ...prev,
      [value]: isNaN(numericCount) ? 0 : numericCount,
    }));
  };

  const handleConfirm = async () => {
    await finalizeCashout(difference, countedTotal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Cierre y Arqueo de Caja</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Columna de conteo */}
          <div>
            <h3 className="font-bold mb-2">Conteo de Efectivo</h3>
            <div className="space-y-2">
              {denominations.map(den => (
                <div key={den.value} className="flex items-center space-x-2">
                  <span className="w-16 font-semibold">{den.label}</span>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) => handleCountChange(den.value, e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Cantidad"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Columna de totales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-4">Resumen de Caja</h3>
            {isLoading ? (
              <p>Cargando datos...</p>
            ) : expectedCash !== null ? (
              <div className="space-y-3 text-lg">
                <div className="flex justify-between">
                  <span>Efectivo Esperado:</span>
                  <span className="font-bold">${expectedCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                <span>Efectivo Contado:</span>
                <span className="font-bold">${countedTotal.toFixed(2)}</span>
              </div>
              <hr/>
                <hr/>
                <div className={`flex justify-between font-bold text-2xl p-2 rounded ${difference === 0 ? 'bg-gray-200' : difference > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <span>Diferencia:</span>
                  <span>{difference >= 0 ? '+' : '-'}${Math.abs(difference).toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p>No se pudieron cargar los datos.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg">Cancelar</button>
          <button onClick={handleConfirm} className="px-5 py-2 bg-blue-600 text-white rounded-lg">Confirmar Cierre</button>
        </div>
      </div>
    </div>
  );
};

export default CashoutModal;
