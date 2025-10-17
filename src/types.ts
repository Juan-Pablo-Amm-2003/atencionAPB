export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  imageUrl: string;
  isWeightProduct?: boolean;
  currentStock: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface TicketItem extends Product {
  quantity: number;
}