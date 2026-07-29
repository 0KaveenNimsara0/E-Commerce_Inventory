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

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  subTotal: number;
}

export interface OrderDetail {
  id: string;
  customerId: string;
  customerName: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
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

export interface OrderItemFormData {
  productId: string;
  quantity: string;
}

export interface OrderFormData {
  customerId: string;
  items: OrderItemFormData[];
}

export type TabType = 'products' | 'orders' | 'customers';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
