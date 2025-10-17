import { useState } from 'react';
import type { Category } from '../types';
import { IoFastFoodOutline, IoIceCreamOutline, IoWineOutline, IoStorefrontOutline } from 'react-icons/io5';
import type { IconType } from 'react-icons';

interface CategorySelectorPanelProps {
  categories: Category[];
  onSelectCategory: (categoryId: number) => void;
  onOpenCashout: () => void;
  onLogout: () => void;
  className?: string;
}

const iconMap: { [key: string]: IconType } = {
  'Panes': IoFastFoodOutline,
  'Facturas': IoIceCreamOutline,
  'Tortas': IoIceCreamOutline, 
  'Bebidas': IoWineOutline,
  'Especiales': IoStorefrontOutline,
};

const CategorySelectorPanel = ({ categories, onSelectCategory, onOpenCashout, onLogout, className }: CategorySelectorPanelProps) => {
  const [selectedId, setSelectedId] = useState(categories.length > 0 ? categories[0].id : null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onSelectCategory(id);
  };

  return (
    <div className={`bg-gray-900 text-white p-4 flex flex-col ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">Valentín</h2>
      <div className="flex-grow space-y-3">
        {categories.map((category) => {
          const Icon = iconMap[category.name] || IoFastFoodOutline; // Icono por defecto
          return (
            <button
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                selectedId === category.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              <Icon className="mr-4 text-2xl" />
              <span className="font-semibold text-lg">{category.name}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 border-t border-gray-700 pt-4 space-y-3">
        <button
          onClick={onOpenCashout}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          CERRAR CAJA
        </button>
        <button
          onClick={onLogout}
          className="w-full bg-gray-700 text-white font-bold py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
};

export default CategorySelectorPanel;