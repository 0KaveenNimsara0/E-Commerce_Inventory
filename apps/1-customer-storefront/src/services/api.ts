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

export interface SystemStats {
  totalProducts: number;
  pendingOrders: number;
  totalRevenue: number;
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = 'http://localhost:5048/api';

async function apiFetch<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`);
  } catch {
    throw new ApiError('Cannot reach the API server. Make sure the .NET backend is running on port 5000.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(`API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchStats(): Promise<SystemStats> {
  return apiFetch<SystemStats>('/stats');
}

export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/inventory');
}

export async function fetchOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/orders');
}

export async function createProduct(product: {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}): Promise<Product> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
  } catch {
    throw new ApiError('Cannot reach the API server. Make sure the .NET backend is running on port 5000.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(`Failed to create product — ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<Product>;
}
