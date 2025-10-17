import type { SaleData } from '../services/apiService';

interface SalesReportProps {
  salesHistory: SaleData[];
}

const SalesReport = ({ salesHistory }: SalesReportProps) => {

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reporte de Ventas de la Sesión</h2>
      {salesHistory.length === 0 ? (
        <p className="text-gray-500">No se han registrado ventas en esta sesión.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">ID Venta</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Método de Pago</th>
                <th className="py-2 px-4 text-left">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {salesHistory.map(sale => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 font-mono text-sm">{sale.id}</td>
                  <td className="py-2 px-4 font-bold">${sale.total.toFixed(2)}</td>
                  <td className="py-2 px-4">{sale.method.replace('_', ' ')}</td>
                  <td className="py-2 px-4">{formatTimestamp(sale.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
