import type { Product, Order, Customer, SystemStats, ProductFormData, CustomerFormData, OrderFormData, OrderDetail } from '../types';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5048/api';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new ApiError('Cannot reach the API server. Make sure the .NET backend is running on port 5048.');
  }

  if (res.status === 24) return {} as T;

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(`API error ${res.status}: ${text || res.statusText}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

export async function fetchStats(): Promise<SystemStats> {
  return apiFetch<SystemStats>('/stats');
}

export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/inventory');
}

export async function createProduct(productData: ProductFormData): Promise<Product> {
  return apiFetch<Product>('/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      stockQuantity: parseInt(productData.stockQuantity, 10) || 0,
    }),
  });
}

export async function updateProduct(id: string, productData: ProductFormData): Promise<Product> {
  return apiFetch<Product>(`/inventory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      stockQuantity: parseInt(productData.stockQuantity, 10) || 0,
      isActive: productData.isActive,
    }),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch<void>(`/inventory/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/orders');
}

export async function createOrder(orderData: OrderFormData): Promise<OrderDetail> {
  return apiFetch<OrderDetail>('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerId: orderData.customerId,
      items: orderData.items.map(item => ({
        productId: item.productId,
        quantity: parseInt(item.quantity, 10) || 0,
      })),
    }),
  });
}

export async function fetchOrderDetail(id: string): Promise<OrderDetail> {
  return apiFetch<OrderDetail>(`/orders/${id}`);
}

export async function updateOrderStatus(id: string, status: string): Promise<OrderDetail> {
  return apiFetch<OrderDetail>(`/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export async function cancelOrder(id: string): Promise<void> {
  await apiFetch<void>(`/orders/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>('/customers');
}

export async function createCustomer(customerData: CustomerFormData): Promise<Customer> {
  return apiFetch<Customer>('/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      isActive: customerData.isActive,
    }),
  });
}

export async function updateCustomer(id: string, customerData: CustomerFormData): Promise<Customer> {
  return apiFetch<Customer>(`/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      isActive: customerData.isActive,
    }),
  });
}
