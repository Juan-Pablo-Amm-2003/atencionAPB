import type { Product, TicketItem, Category } from "../types";

// **********************************************
// * 1. BASE DE DATOS SIMULADA (ALMACÉN DE DATOS) *
// **********************************************

// Datos de MockData que ahora actúan como la fuente de verdad del servidor.
const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Panes' },
  { id: 2, name: 'Facturas' },
  { id: 3, name: 'Tortas' },
  { id: 4, name: 'Bebidas' },
  { id: 5, name: 'Especiales' },
];

const INITIAL_PRODUCTS: Product[] = [
  // Panes
  { id: 101, name: 'Pan Francés', price: 1.50, categoryId: 1, imageUrl: '/images/pan-frances.jpg', currentStock: 50 },
  { id: 102, name: 'Baguette', price: 2.00, categoryId: 1, imageUrl: '/images/baguette.jpg', currentStock: 30 },
  { id: 103, name: 'Pan de Campo', price: 3.50, categoryId: 1, imageUrl: '/images/pan-de-campo.jpg', isWeightProduct: true, currentStock: 15 },

  // Facturas
  { id: 201, name: 'Croissant', price: 1.20, categoryId: 2, imageUrl: '/images/croissant.jpg', currentStock: 0 }, // Sin stock
  { id: 202, name: 'Medialuna', price: 1.00, categoryId: 2, imageUrl: '/images/medialuna.jpg', currentStock: 100 },
  { id: 203, name: 'Vigilante', price: 1.10, categoryId: 2, imageUrl: '/images/vigilante.jpg', currentStock: 3 }, // Stock bajo

  // Tortas
  { id: 301, name: 'Torta de Chocolate', price: 25.00, categoryId: 3, imageUrl: '/images/torta-de-chocolate.jpg', currentStock: 5 },
  { id: 302, name: 'Cheesecake', price: 22.50, categoryId: 3, imageUrl: '/images/cheesecake.jpg', currentStock: 8 },
  { id: 303, name: 'Lemon Pie', price: 20.00, categoryId: 3, imageUrl: '/images/lemon-pie.jpg', currentStock: 0 }, // Sin stock

  // Bebidas
  { id: 401, name: 'Café', price: 2.50, categoryId: 4, imageUrl: '/images/cafe.jpg', currentStock: 100 },
  { id: 402, name: 'Jugo de Naranja', price: 3.00, categoryId: 4, imageUrl: '/images/jugo-de-naranja.jpg', currentStock: 40 },
  { id: 403, name: 'Agua Mineral', price: 1.50, categoryId: 4, imageUrl: '/images/agua-mineral.jpg', currentStock: 60 },

  // Especiales
  { id: 501, name: 'Sandwich de Jamón y Queso', price: 7.50, categoryId: 5, imageUrl: '/images/sandwich-de-jamon-y-queso.jpg', currentStock: 12 },
  { id: 502, name: 'Ensalada César', price: 9.00, categoryId: 5, imageUrl: '/images/ensalada-cesar.jpg', currentStock: 8 },
  { id: 503, name: 'Tarta de Verduras', price: 6.00, categoryId: 5, imageUrl: '/images/tarta-de-verduras.jpg', isWeightProduct: true, currentStock: 10 },
];

// Estado mutable del "servidor"
let currentProducts: Product[] = [...INITIAL_PRODUCTS];
let sales: SaleData[] = [];
let cashTotal = 0; // Total de efectivo esperado para el arqueo

// **********************************************
// * 2. TIPOS DE DATOS Y UTILIDADES *
// **********************************************

const simulateLatency = () => new Promise(resolve => {
    const latency = Math.random() * 700 + 300;
    setTimeout(resolve, latency);
});

export interface SaleData {
    id: string;
    items: TicketItem[];
    total: number;
    method: string;
    user: string;
    customer?: string;
    timestamp: string;
    isFinished: boolean; // Para simular si la venta se cerró o se dejó en cuenta
}

export type NewProduct = Omit<Product, 'id'>;

// **********************************************
// * 3. FUNCIONES DE LECTURA (GET) *
// **********************************************

/**
 * Obtiene las categorías.
 */
export const getCategories = async (): Promise<Category[]> => {
    await simulateLatency();
    return INITIAL_CATEGORIES;
};

/**
 * Obtiene el estado actual de los productos (incluyendo stock y precios).
 */
export const getProducts = async (): Promise<Product[]> => {
    await simulateLatency();
    return currentProducts;
};

/**
 * Simula la obtención de datos para el arqueo de caja (Tarea #7).
 */
export const getCashoutData = async (): Promise<number> => {
    await simulateLatency();
    // El efectivo esperado es la suma de todas las ventas en efectivo
    const totalCashSales = sales
        .filter(s => s.method === 'EFECTIVO' && s.isFinished)
        .reduce((sum, sale) => sum + sale.total, 0);
    
    cashTotal = totalCashSales;
    return cashTotal;
};

/**
 * Obtiene el historial de ventas registradas en esta sesión.
 */
export const getSalesHistory = async (user: string): Promise<SaleData[]> => {
    await simulateLatency();
    console.log(`[API]: Obteniendo historial para ${user}`);
    // Retorna las ventas de la sesión filtradas por el usuario actual
    return sales.filter(s => s.user === user).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// **********************************************
// * 4. FUNCIONES DE ESCRITURA (POST/PUT) *
// **********************************************

/**
 * Simula el envío de una venta al backend y actualiza el stock local.
 */
export const saveSale = async (data: Omit<SaleData, 'id' | 'timestamp' | 'isFinished'> & { user: string }): Promise<string> => {
    await simulateLatency();

    // Simulación de fallo (ej: 10% de las veces)
    if (Math.random() < 0.1) {
        throw new Error("Error de conexión al servidor. Intente de nuevo.");
    }

    // 1. Registrar la venta
    const saleId = `VENTA-${sales.length + 1}-${Date.now()}`;
    const newSale: SaleData = {
        ...data,
        id: saleId,
        timestamp: new Date().toISOString(),
        isFinished: true // Asumimos que si llega aquí, la venta se completó
    };
    sales.push(newSale);
    
    // 2. Actualizar el stock
    newSale.items.forEach(item => {
        const productIndex = currentProducts.findIndex(p => p.id === item.id);
        if (productIndex !== -1) {
            currentProducts[productIndex].currentStock = Math.max(0, currentProducts[productIndex].currentStock - item.quantity);
        }
    });


    console.log(`[API]: Venta ${saleId} registrada con éxito. Stock actualizado.`, newSale);
    return saleId;
};

/**
 * Simula la actualización de datos de un producto (desde el Dashboard).
 */
export const updateProductData = async (product: Product): Promise<Product> => {
    await simulateLatency();
    
    const productIndex = currentProducts.findIndex(p => p.id === product.id);
    
    if (productIndex !== -1) {
        // Actualizar precio y stock
        currentProducts[productIndex] = { ...currentProducts[productIndex], ...product };
        console.log(`[API]: Producto ${product.id} actualizado.`, currentProducts[productIndex]);
        return currentProducts[productIndex];
    } else {
        throw new Error(`Producto con ID ${product.id} no encontrado.`);
    }
};

/**
 * Simula el registro del cierre de caja (Tarea #7).
 */
export const finalizeCashout = async (difference: number, cashCounted: number): Promise<void> => {
    await simulateLatency();

    if (Math.abs(difference) > 500) {
        console.warn(`[API]: GRAN DESCUADRE DE CAJA DETECTADO: $${difference}`);
    }
    
    // Aquí se enviaría el reporte final de caja.
    cashTotal = 0; // Se resetea el total de efectivo esperado después del cierre
    sales = sales.filter(s => s.method !== 'EFECTIVO'); // Limpiamos las ventas de efectivo para el próximo turno.

    console.log(`[API]: Arqueo de caja registrado. Contado: $${cashCounted.toFixed(2)}. Diferencia: $${difference.toFixed(2)}. Ventas de efectivo limpiadas.`);
};

/**
 * Simula el cierre de sesión (Tarea #11).
 */
export const createProduct = async (data: NewProduct): Promise<Product> => {
    await simulateLatency();
    const newProduct: Product = {
        ...data,
        id: Date.now(),
    };
    currentProducts.push(newProduct);
    console.log(`[API]: Nuevo producto creado: ${newProduct.name}`, newProduct);
    return newProduct;
};

/**
 * Simula la creación de una nueva categoría.
 */
export const createCategory = async (name: string): Promise<Category> => {
    await simulateLatency();
    if (!name || name.trim() === '') {
        throw new Error('El nombre de la categoría no puede estar vacío.');
    }
    const newCategory: Category = {
        id: Date.now(),
        name: name.trim(),
    };
    INITIAL_CATEGORIES.push(newCategory);
    console.log(`[API]: Nueva categoría creada: ${newCategory.name}`, newCategory);
    return newCategory;
};

/**
 * Simula la eliminación de un producto.
 */
export const deleteProduct = async (productId: number): Promise<void> => {
    await simulateLatency();
    const productIndex = currentProducts.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        throw new Error(`Producto con ID ${productId} no encontrado.`);
    }
    const deletedProduct = currentProducts[productIndex];
    currentProducts.splice(productIndex, 1);
    console.log(`[API]: Producto eliminado: ${deletedProduct.name}`, deletedProduct);
};

/**
 * Simula la actualización de una categoría.
 */
export const updateCategory = async (categoryId: number, newName: string): Promise<Category> => {
    await simulateLatency();
    const categoryIndex = INITIAL_CATEGORIES.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) {
        throw new Error(`Categoría con ID ${categoryId} no encontrada.`);
    }
    if (!newName || newName.trim() === '') {
        throw new Error('El nombre de la categoría no puede estar vacío.');
    }
    INITIAL_CATEGORIES[categoryIndex].name = newName.trim();
    console.log(`[API]: Categoría actualizada:`, INITIAL_CATEGORIES[categoryIndex]);
    return INITIAL_CATEGORIES[categoryIndex];
};

/**
 * Simula la eliminación de una categoría.
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
    await simulateLatency();
    const isCategoryInUse = currentProducts.some(p => p.categoryId === categoryId);
    if (isCategoryInUse) {
        throw new Error('No se puede eliminar la categoría porque está en uso por uno o más productos.');
    }
    const categoryIndex = INITIAL_CATEGORIES.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) {
        throw new Error(`Categoría con ID ${categoryId} no encontrada.`);
    }
    const deletedCategory = INITIAL_CATEGORIES[categoryIndex];
    INITIAL_CATEGORIES.splice(categoryIndex, 1);
    console.log(`[API]: Categoría eliminada:`, deletedCategory);
};

export const logoutUser = async (): Promise<void> => {
    await simulateLatency();
    console.log("[API]: Sesión cerrada en el servidor.");
};