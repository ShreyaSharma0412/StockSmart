export interface Category {
  id?: number;
  name: string;
  description?: string;
}

export interface Supplier {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  code?: string;
  rating?: number;
  leadTimeDays?: number;
}

export interface Product {
  id?: number;
  name: string;
  sku: string;
  barcode?: string;
  rfidTag?: string;
  description?: string;
  price: number;
  quantity: number;
  minStockLevel?: number;
  reorderQuantity?: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Warning' | string;
  location?: string;
  imageUrl?: string;
  turnoverRate?: number;
  category?: Category;
  supplier?: Supplier;
  totalValue?: number;
}

export interface StockTransaction {
  id?: number;
  product?: Product;
  type: string; // 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'AUDIT'
  quantity: number;
  sourceLocation?: string;
  destinationLocation?: string;
  transactionDate?: string;
  remarks?: string;
}

export interface PurchaseOrder {
  id?: number;
  poNumber: string;
  supplier?: Supplier;
  product?: Product;
  quantity: number;
  totalAmount: number;
  status: 'RECOMMENDED' | 'SENT' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | string;
  eta?: string;
  createdAt?: string;
}

export interface KpiSummary {
  totalInventoryValue: number;
  totalInventoryValueTrend: string;
  lowStockAlerts: number;
  lowStockAlertsTrend: string;
  avgTurnoverRate: number;
  avgTurnoverRateTrend: string;
  potentialLostRevenue: number;
  potentialLostRevenueTrend: string;
}
