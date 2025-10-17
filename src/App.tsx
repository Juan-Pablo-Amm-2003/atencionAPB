import { useState, useEffect } from "react";
// Se elimina ActionsPanel
import CategorySelectorPanel from "./components/CategorySelectorPanel"; 
import CatalogPanel from "./components/CatalogPanel";
import PaymentModal from "./components/PaymentModal";
import QuantityModal from "./components/QuantityModal";
import TicketPanel from "./components/TicketPanel";
import DiscountModal from "./components/DiscountModal";
import WeightModal from "./components/WeightModal";
import CashoutModal from "./components/CashoutModal";
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import ToastNotification, { type ToastType } from './components/ToastNotification';
import { getProducts, getCategories, saveSale, logoutUser } from './services/apiService';
import type { SaleData } from './services/apiService';
import type { Product, TicketItem, Category } from "./types";

interface User {
  username: string;
  role: 'employee' | 'admin';
}

function App() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [ticketItems, setTicketItems] = useState<TicketItem[]>([]);
  const [editingItem, setEditingItem] = useState<TicketItem | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [isDiscountModalOpen, setDiscountModalOpen] = useState(false);
  const [quickQuantity, setQuickQuantity] = useState(1);
  const [productForWeighting, setProductForWeighting] = useState<Product | null>(null);
  const [isCashoutModalOpen, setCashoutModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [salesHistory, setSalesHistory] = useState<SaleData[]>([]);

  const subtotal = ticketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discountValue;

  const addItemToTicket = (productId: number) => {
    const productToAdd = allProducts.find((p) => p.id === productId);
    if (!productToAdd) return;

    setTicketItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quickQuantity }
            : item
        );
      } else {
          return [...prevItems, { ...productToAdd, quantity: quickQuantity }];
      }
    });
    setQuickQuantity(1);
    showToast(`'${productToAdd.name}' añadido`, 'success');
  };

  const addWeightedItemToTicket = (productId: number, weight: number) => {
    const productToAdd = allProducts.find((p) => p.id === productId);
    if (!productToAdd) return;

    setTicketItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + weight }
            : item
        );
      } else {
          return [...prevItems, { ...productToAdd, quantity: weight }];
      }
    });
    showToast(`'${productToAdd.name}' añadido`, 'success');
  };

  const updateItemQuantity = (productId: number, newQuantity: number) => {
    setTicketItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItemFromTicket = (productId: number) => {
    setTicketItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    setEditingItem(null);
  };

  const applyDiscount = (amount: number) => {
    setDiscountValue(amount);
    setDiscountModalOpen(false);
  };

  const clearTicket = () => {
    setTicketItems([]);
    setDiscountValue(0);
  };

  const handleFinalizeSale = async (method: string, customer?: string) => {
    if (!currentUser) return;

    const saleData: SaleData = {
      items: ticketItems,
      total,
      method,
      customer,
      user: currentUser.username,
      id: "",
      timestamp: "",
      isFinished: false
    };

    setIsSaving(true);
    try {
      const saleId = await saveSale(saleData);
      
      // Añadir al historial local de la sesión
      setSalesHistory(prev => [...prev, { ...saleData, id: saleId, timestamp: new Date().toISOString() }]);

      clearTicket();
      setPaymentModalOpen(false);
      showToast('Venta registrada con éxito', 'success');
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = (username: string) => {
    const role = username.toLowerCase() === 'admin' ? 'admin' : 'employee';
    const user: User = { username, role };

    setIsAuthenticated(true);
    setCurrentUser(user);
    showToast(`¡Bienvenido, ${user.username}!`, 'success');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearTicket();
      setIsAuthenticated(false);
      setCurrentUser(null);
      showToast('Sesión cerrada con éxito', 'info');
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleOpenCashout = () => {
    setCashoutModalOpen(true);
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleProductSelect = (product: Product) => {
    if (product.currentStock <= 0) {
      showToast(`'${product.name}' no tiene stock`, 'error');
      return;
    }

    if (product.isWeightProduct) {
      setProductForWeighting(product);
    } else {
      addItemToTicket(product.id);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setQuickQuantity(parseInt(e.key, 10));
      }
    }; 
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [products, categories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setAllProducts(products);
        setAllCategories(categories);
        if (categories.length > 0) {
          setSelectedCategoryId(categories[0].id);
        }
      } catch (error) {
        showToast('Error al cargar los datos. Intente de nuevo.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (isLoading && isAuthenticated) {
    return (
      <div className="h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-2xl font-semibold">Cargando Productos...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {!isAuthenticated || !currentUser ? (
        <LoginModal onLogin={handleLogin} />
      ) : currentUser.role === 'admin' ? (
        <AdminDashboard onLogout={handleLogout} showToast={showToast} salesHistory={salesHistory} />
      ) : (
        // Vista del Empleado (POS)
        <main className="flex-grow grid grid-cols-12">
          <CategorySelectorPanel 
            className="col-span-2" 
            categories={allCategories}
            onSelectCategory={setSelectedCategoryId}
            onOpenCashout={handleOpenCashout}
            onLogout={handleLogout}
          />
          <CatalogPanel 
            products={allProducts}
            onProductSelect={handleProductSelect} 
            selectedCategoryId={selectedCategoryId}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            quickQuantity={quickQuantity}
            className="col-span-7"
          /> 
          <TicketPanel 
            items={ticketItems} 
            onEditItem={setEditingItem} 
            onUpdateQuantity={updateItemQuantity}
            onRemoveItem={removeItemFromTicket}
            onCancelSale={clearTicket} 
            onPay={() => setPaymentModalOpen(true)}
            onApplyDiscount={() => setDiscountModalOpen(true)}
            discount={discountValue}
            subtotal={subtotal}
            isSaving={isSaving}
            className="col-span-3"
          /> 
        </main>
      )}

      {/* Modals para la vista del POS */}
      {isAuthenticated && currentUser?.role === 'employee' && (
        <>
          <QuantityModal item={editingItem} onClose={() => setEditingItem(null)} onUpdateQuantity={updateItemQuantity} onRemoveItem={removeItemFromTicket} />
          <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} total={total} onFinalizeSale={handleFinalizeSale} showToast={showToast} isSaving={isSaving} />
          <DiscountModal isOpen={isDiscountModalOpen} onClose={() => setDiscountModalOpen(false)} onApplyDiscount={applyDiscount} />
          <WeightModal product={productForWeighting} onClose={() => setProductForWeighting(null)} onAddItem={addWeightedItemToTicket} />
          <CashoutModal isOpen={isCashoutModalOpen} onClose={() => setCashoutModalOpen(false)} />
        </>
      )}

      {/* Toast siempre disponible */}
      {toast && (
        <ToastNotification 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

export default App;