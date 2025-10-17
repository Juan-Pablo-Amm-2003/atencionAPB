import type { Product } from '../types';

interface CatalogPanelProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  selectedCategoryId: number | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  quickQuantity: number;
  className?: string;
}

// Se puede crear un componente ProductCard para más limpieza, pero lo dejaremos en línea para simplicidad.
const ProductCard = ({ product, onProductSelect }: { product: Product, onProductSelect: (product: Product) => void }) => {
  const hasStock = product.currentStock > 0;

  return (
    <div 
        key={product.id}
        onClick={() => hasStock && onProductSelect(product)}
        className={`bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all relative group flex flex-col ${hasStock ? 'cursor-pointer hover:shadow-2xl hover:border-blue-500 hover:-translate-y-1' : 'opacity-50 cursor-not-allowed'}`}
    >
        {!hasStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <span className="text-white text-2xl font-bold bg-red-600 px-4 py-2 rounded-lg">SIN STOCK</span>
          </div>
        )}
        <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="p-3 flex-grow flex flex-col">
            <span className="text-xl font-extrabold block truncate text-gray-800 flex-grow">{product.name}</span>
            <span className="text-3xl font-black text-red-600 mt-1">${product.price.toFixed(2)}</span>
        </div>
        
        {/* Botón de añadir rápido: la acción más importante */}
        {hasStock && (
          <div className="p-3 pt-0">
            <div
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-center group-hover:bg-blue-700 transition-colors"
            >
                + Añadir
            </div>
          </div>
        )}
    </div>
  );
};

const CatalogPanel = ({ products, onProductSelect, selectedCategoryId, searchTerm, onSearchChange, quickQuantity, className }: CatalogPanelProps) => {
  const filteredProducts = products.filter((product) => {
    if (selectedCategoryId === null) return false;
    const matchesCategory = product.categoryId === selectedCategoryId;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`bg-gray-100 p-6 flex flex-col ${className}`}>
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        {quickQuantity > 1 && (
          <div className="bg-orange-500 text-white text-lg font-bold px-4 py-2 rounded-lg">
            Cantidad Activa: {quickQuantity}
          </div>
        )}
      </div>
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Selección de Productos</h2>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
          {filteredProducts.map((product) => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onProductSelect={onProductSelect} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogPanel;