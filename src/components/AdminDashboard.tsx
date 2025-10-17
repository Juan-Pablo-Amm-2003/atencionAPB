import React, { useState } from 'react';
import { IoBarChartOutline, IoCashOutline, IoWalletOutline, IoThumbsDownOutline } from 'react-icons/io5';
import InventoryManagement from './InventoryManagement';
import SalesReport from './SalesReport';
import type { ToastType } from './ToastNotification';
import type { SaleData } from '../services/apiService';

// Definición de las props que recibirá del App.tsx
interface AdminDashboardProps {
  onLogout: () => void;
  showToast: (message: string, type: ToastType) => void;
  salesHistory: SaleData[];
}

// Componente de una tarjeta de métrica simple
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change: string;
  rawValue?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, change, rawValue }) => {
  const cardColor = title === 'Descuadre Caja' && (rawValue === undefined || rawValue >= 0) ? 'bg-blue-600' : color;

  return (
    <div className={`p-6 rounded-xl shadow-lg ${cardColor} text-white flex flex-col`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-6xl opacity-80">{icon}</div>
        <div className={`text-lg font-bold ${change.startsWith('+') ? 'bg-green-500' : 'bg-red-500'} px-2 py-1 rounded-full`}>{change}</div>
      </div>
      <div className="mt-auto">
        <div className="text-xl font-semibold uppercase">{title}</div>
        <div className="text-4xl font-black mt-1">{value}</div>
      </div>
    </div>
  );
};

// Componente principal
const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, showToast, salesHistory }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'inventory' | 'reports'>('dashboard');

  // Datos simulados para el Dashboard
  const metrics = [
    { title: "Venta Total Hoy", value: "$ 48,500.50", icon: <IoCashOutline />, color: "bg-blue-600", change: "+5.2%" },
    { title: "Ticket Promedio", value: "$ 812.20", icon: <IoWalletOutline />, color: "bg-teal-600", change: "-1.8%" },
    { title: "Productos Vendidos", value: "324", icon: <IoBarChartOutline />, color: "bg-indigo-600", change: "+12%" },
    { title: "Descuadre Caja", value: "$ 0.00", icon: <IoThumbsDownOutline />, color: "bg-red-600", change: "0%", rawValue: 0 },
  ];

  return (
    <div className="h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center pb-6 border-b border-gray-300 mb-6">
        <h1 className="text-4xl font-light text-gray-800">Panel de Administración</h1>
        <div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="mb-6 flex space-x-4 border-b pb-2">
        <button onClick={() => setActiveView('dashboard')} className={`px-4 py-2 rounded-t-lg font-semibold ${activeView === 'dashboard' ? 'bg-white border-b-2 border-blue-600' : 'text-gray-600'}`}>Dashboard</button>
        <button onClick={() => setActiveView('inventory')} className={`px-4 py-2 rounded-t-lg font-semibold ${activeView === 'inventory' ? 'bg-white border-b-2 border-blue-600' : 'text-gray-600'}`}>Inventario</button>
        <button onClick={() => setActiveView('reports')} className={`px-4 py-2 rounded-t-lg font-semibold ${activeView === 'reports' ? 'bg-white border-b-2 border-blue-600' : 'text-gray-600'}`}>Reportes</button>
      </nav>

      <main>
        {activeView === 'dashboard' && (
          <>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Métricas Rápidas (Hoy)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
              ))}
            </div>
          </>
        )}
        {activeView === 'inventory' && <InventoryManagement showToast={showToast} />}
        {activeView === 'reports' && <SalesReport salesHistory={salesHistory} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
