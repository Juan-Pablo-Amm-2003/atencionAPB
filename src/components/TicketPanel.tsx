import type { TicketItem } from '../types';

interface TicketPanelProps {
  items: TicketItem[];
  onEditItem: (item: TicketItem) => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCancelSale: () => void;
  onPay: () => void;
  onApplyDiscount: () => void;
  discount: number;
  subtotal: number;
  isSaving: boolean;
  className?: string;
}

const TicketPanel = ({ items, onEditItem, onUpdateQuantity, onRemoveItem, onCancelSale, onPay, onApplyDiscount, discount, subtotal, isSaving, className }: TicketPanelProps) => {
  const total = subtotal - discount;

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar la venta?')) {
      onCancelSale();
    }
  };

  return (
    <div className={`bg-white border-l-4 border-gray-200 p-4 flex flex-col ${className}`}>
      <h2 className="text-3xl font-black mb-4 text-blue-800 flex-shrink-0">TICKET ACTUAL</h2>
      
      {/* Lista de Ítems */}
      <div className="flex-grow overflow-y-auto border-b-2 mb-4 pb-4">
        {items.length === 0 ? (
          <p className="text-xl text-gray-500 font-semibold text-center mt-10">Agrega productos para empezar.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2 p-3 rounded-xl bg-gray-50 border">
              <div className="flex-grow cursor-pointer" onClick={() => onEditItem(item)}>
                <span className="text-2xl font-black text-red-600 mr-2">{item.quantity}x</span>
                <span className="font-semibold text-lg">{item.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    const newQuantity = item.quantity - 1;
                    if (newQuantity > 0) {
                      onUpdateQuantity(item.id, newQuantity);
                    } else {
                      onRemoveItem(item.id);
                    }
                  }}
                  className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
                  title="Restar 1"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                </button>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                  title="Eliminar producto"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Área de Totales */}
      <div className="flex-shrink-0">
        <div className="flex justify-between font-bold text-xl">
          <span>SUBTOTAL</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between font-bold text-xl text-green-600">
            <span>DESCUENTO</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-5xl mt-3 text-red-600 bg-red-100 p-2 rounded-lg">
          <span>TOTAL</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Botones de Acción (Reemplaza ActionsPanel) */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between space-x-2">
            <button 
              onClick={handleCancel}
              disabled={isSaving}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors text-md disabled:bg-gray-100"
            >
              CANCELAR
            </button>
            <button 
              onClick={onApplyDiscount} 
              disabled={items.length === 0 || isSaving}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors text-md disabled:bg-gray-100"
            >
              APLICAR DESCUENTO
            </button>
          </div>
          <button 
            onClick={onPay}
            disabled={items.length === 0 || isSaving}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 text-2xl"
          >
            {isSaving ? 'GUARDANDO...' : 'PAGAR'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPanel;