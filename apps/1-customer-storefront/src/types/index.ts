export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  status: string;
  totalAmount: number;
  currency: string;
  itemsCount: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isActive: boolean;
}

export interface SystemStats {
  totalProducts: number;
  pendingOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  isActive: boolean;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

export type TabType = 'products' | 'orders' | 'customers';
