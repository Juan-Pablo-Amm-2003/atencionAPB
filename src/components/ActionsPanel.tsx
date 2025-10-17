interface ActionsPanelProps {
  onCancelSale: () => void;
  onPay: () => void;
}

const ActionsPanel = ({ onCancelSale, onPay }: ActionsPanelProps) => {
  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar la venta?')) {
      onCancelSale();
    }
  };

  return (
    <div className="w-[10%] bg-gray-100 border-l border-gray-200 flex flex-col p-4 space-y-4 justify-end">
      <button onClick={onPay} className="bg-green-600 text-white font-bold text-2xl py-6 rounded-lg hover:bg-green-700 transition-colors">
        PAGAR
      </button>
      <button
        onClick={handleCancel}
        className="bg-red-600 text-white font-bold text-2xl py-6 rounded-lg hover:bg-red-700 transition-colors">
        CANCELAR
      </button>
    </div>
  );
};

export default ActionsPanel;
