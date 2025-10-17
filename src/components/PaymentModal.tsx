import { useState } from 'react';
import type { ToastType } from './ToastNotification';
import { IoWalletOutline, IoCardOutline, IoPhonePortraitOutline, IoPersonOutline } from 'react-icons/io5';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onFinalizeSale: (method: PaymentMethod, customer?: string) => void;
  showToast: (message: string, type: ToastType) => void;
  isSaving: boolean;
}

type PaymentMethod = 'EFECTIVO' | 'TARJETA' | 'MERCADO_PAGO' | 'CUENTA_CORRIENTE';

const BILL_VALUES = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10]; // Valores de billetes para botones rápidos

const PaymentModal = ({ isOpen, onClose, total, onFinalizeSale, showToast, isSaving }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [amountReceived, setAmountReceived] = useState(0); 
  const [customerName, setCustomerName] = useState('');

  if (!isOpen) return null;

  const change = Math.max(0, amountReceived - total); 

  const handleSelectMethod = (method: PaymentMethod) => {
        setPaymentMethod(method);
        setAmountReceived(0);
        setCustomerName('');
   };

  const addBill = (value: number) => {
    setAmountReceived(prev => prev + value);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmountReceived(isNaN(value) ? 0 : value);
  }


  const handleFinalize = () => {
    if (!paymentMethod) return;

    if (paymentMethod === 'EFECTIVO' && amountReceived < total) {
      showToast('El monto recibido es menor al total', 'error');
      return;
    }
    
    onFinalizeSale(paymentMethod, customerName);
    setPaymentMethod(null);
    setAmountReceived(0);
  };

  const isCashPaymentComplete = paymentMethod === 'EFECTIVO' && amountReceived >= total;
  const isCreditPaymentComplete = paymentMethod === 'CUENTA_CORRIENTE' && customerName.trim() !== '';
  const canFinalize = paymentMethod && (paymentMethod !== 'EFECTIVO' || isCashPaymentComplete) && (paymentMethod !== 'CUENTA_CORRIENTE' || isCreditPaymentComplete);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl shadow-2xl">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-blue-800">Caja - Pasarela de Pagos</h2>
        
        {/* TOTAL A PAGAR - Destacado y Grande */}
        <div className="bg-blue-600 text-white p-4 rounded-xl mb-6 flex justify-between items-center shadow-lg">
          <span className="text-3xl font-light">TOTAL A PAGAR:</span>
          <span className="text-7xl font-black">${total.toFixed(2)}</span>
        </div>

        {/* Métodos de Pago - Botones Grandes */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button onClick={() => handleSelectMethod('EFECTIVO')} 
            className={`flex flex-col items-center justify-center p-6 text-2xl font-bold rounded-xl transition-all shadow-md ${paymentMethod === 'EFECTIVO' ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-red-100'}`}><IoWalletOutline className="mb-2 text-4xl" /> EFECTIVO</button>
          <button onClick={() => handleSelectMethod('TARJETA')} 
            className={`flex flex-col items-center justify-center p-6 text-2xl font-bold rounded-xl transition-all shadow-md ${paymentMethod === 'TARJETA' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-blue-100'}`}><IoCardOutline className="mb-2 text-4xl" /> TARJETA</button>
          <button onClick={() => handleSelectMethod('MERCADO_PAGO')} 
            className={`flex flex-col items-center justify-center p-6 text-2xl font-bold rounded-xl transition-all shadow-md ${paymentMethod === 'MERCADO_PAGO' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-purple-100'}`}><IoPhonePortraitOutline className="mb-2 text-4xl" /> MERCADO PAGO</button>
          <button onClick={() => handleSelectMethod('CUENTA_CORRIENTE')} 
            className={`flex flex-col items-center justify-center p-6 text-2xl font-bold rounded-xl transition-all shadow-md ${paymentMethod === 'CUENTA_CORRIENTE' ? 'bg-orange-600 text-white' : 'bg-gray-200 hover:bg-orange-100'}`}><IoPersonOutline className="mb-2 text-4xl" /> FÍO</button>
        </div>

        {/* Lógica de Vuelto y Billetes (EFECTIVO) */}
        {paymentMethod === 'EFECTIVO' && (
          <div className="grid grid-cols-2 gap-6 bg-yellow-50 p-6 rounded-xl border-2 border-yellow-300">
            {/* Columna de Billetes Rápidos */}
            <div className="col-span-1">
              <h3 className="text-xl font-extrabold mb-3 text-yellow-800 text-center">Ingreso Rápido</h3>
              <div className="grid grid-cols-3 gap-3">
                {BILL_VALUES.map((value) => (
                  <button key={value} onClick={() => addBill(value)} 
                    className="text-2xl font-bold p-4 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors shadow-md">
                    ${value.toLocaleString('es-AR')}
                  </button>
                ))}
              </div>
              <button onClick={() => setAmountReceived(total)} className="w-full mt-3 text-xl font-bold p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">PAGO EXACTO</button>

            </div>

            {/* Columna de Monto Recibido y Vuelto */}
            <div className='col-span-1 flex flex-col justify-between'>
              <div className="bg-white p-4 rounded-lg shadow-inner text-center">
                <label htmlFor="amount-received" className='text-xl font-semibold'>Monto Recibido:</label>
                <input 
                  id="amount-received"
                  type="number" 
                  value={amountReceived.toFixed(2)} 
                  onChange={handleAmountChange} 
                  className="text-4xl font-black p-2 border-none rounded-lg w-full text-center text-red-600 focus:outline-none" 
                  aria-label="Monto Recibido"
                />
                <button onClick={() => setAmountReceived(0)} className="w-full mt-2 text-md font-bold p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Limpiar</button>
              </div>

              {amountReceived > 0 && (
                <div className="mt-4 p-3 bg-red-500 text-white rounded-lg text-center shadow-lg">
                  <span className="text-2xl font-semibold block">VUELTO:</span>
                  <span className={`text-5xl font-black`}>${change.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Indicaciones para Tarjeta/QR/Fío */}
        {paymentMethod === 'CUENTA_CORRIENTE' && (
          <div className="bg-orange-50 p-6 rounded-lg mb-6 border-2 border-orange-300 shadow-inner">
            <label htmlFor='customer-name' className='text-xl font-bold text-orange-800 block mb-2'>Nombre del Cliente</label>
            <input 
              id='customer-name'
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ingrese el nombre o ID del cliente"
              className="w-full p-3 text-lg border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
        )}

        {paymentMethod !== 'EFECTIVO' && paymentMethod !== 'CUENTA_CORRIENTE' && paymentMethod && (
          <div className="bg-indigo-100 p-6 rounded-lg mb-6 border-2 border-indigo-300 text-center shadow-inner">
            <p className="text-4xl font-black text-indigo-800">
              {paymentMethod === 'TARJETA' ? '¡SOLICITE INSERTAR / ACERCAR LA TARJETA AL POS!' : '¡MUESTRE EL CÓDIGO QR DE MERCADO PAGO!'}
            </p>
          </div>
        )}
        
        {/* Acciones de Cierre */}
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="w-1/3 text-xl font-bold p-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors">
            VOLVER AL TICKET
          </button>
          <button 
            onClick={handleFinalize} 
            disabled={!canFinalize || isSaving} 
            className="w-2/3 text-3xl font-black p-4 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-colors disabled:bg-blue-300">
            {isSaving ? 'GUARDANDO...' : 'CONFIRMAR VENTA'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
