import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import type { Product, Order, Customer, SystemStats, ProductFormData, CustomerFormData } from './types';
import {
  fetchProducts,
  fetchOrders,
  fetchCustomers,
  fetchStats,
  createProduct,
  updateProduct,
  deleteProduct,
  createCustomer,
  updateCustomer,
  ApiError,
} from './services/api';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatsOverview } from './components/common/StatsOverview';
import { ErrorBanner } from './components/common/ErrorBanner';

import { ProductList } from './components/products/ProductList';
import { ProductFormModal } from './components/products/ProductFormModal';

import { OrderList } from './components/orders/OrderList';

import { CustomerList } from './components/customers/CustomerList';
import { CustomerFormModal } from './components/customers/CustomerFormModal';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalProducts: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  const loadData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [prodsData, ordersData, customersData, statsData] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchCustomers(),
        fetchStats(),
      ]);
      setProducts(prodsData);
      setOrders(ordersData);
      setCustomers(customersData);
      setStats(statsData);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'An unexpected error occurred.';
      setApiError(message);
      console.error('Failed to load API data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Product Handlers
  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (formData: ProductFormData, editId?: string) => {
    try {
      if (editId) {
        await updateProduct(editId, formData);
      } else {
        await createProduct(formData);
      }
      loadData();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to save product.';
      alert(message);
      throw err;
    }
  };

  const handleToggleProductStatus = async (product: Product) => {
    try {
      await updateProduct(product.id, {
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stockQuantity: product.stockQuantity.toString(),
        isActive: !product.isActive,
      });
      loadData();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to toggle product status.';
      alert(message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      loadData();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete product.';
      alert(message);
    }
  };

  // Customer Handlers
  const handleOpenAddCustomer = () => {
    setCustomerToEdit(null);
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (formData: CustomerFormData, editId?: string) => {
    try {
      if (editId) {
        await updateCustomer(editId, formData);
      } else {
        await createCustomer(formData);
      }
      loadData();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to save customer.';
      alert(message);
      throw err;
    }
  };

  const handleToggleCustomerStatus = async (customer: Customer) => {
    try {
      await updateCustomer(customer.id, {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        isActive: !customer.isActive,
      });
      loadData();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to toggle customer status.';
      alert(message);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar apiError={apiError} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-900">
        {/* Top Header */}
        <Header
          loading={loading}
          onRefresh={loadData}
          onAddProduct={handleOpenAddProduct}
          onAddCustomer={handleOpenAddCustomer}
        />

        {/* Dynamic Workspace Container */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Error Alert */}
          {apiError && <ErrorBanner message={apiError} onRetry={loadData} />}

          {/* Loading Spinner */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <svg className="w-10 h-10 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-slate-400 text-sm">Loading data from PostgreSQL...</p>
            </div>
          ) : (
            !apiError && (
              <>
                {/* Stats Overview Bar */}
                <StatsOverview stats={stats} />

                {/* Main Views via Router */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                  <Routes>
                    <Route
                      path="/products"
                      element={
                        <ProductList
                          products={products}
                          onEditProduct={handleOpenEditProduct}
                          onToggleStatus={handleToggleProductStatus}
                          onDeleteProduct={handleDeleteProduct}
                          onAddFirstProduct={handleOpenAddProduct}
                        />
                      }
                    />
                    <Route path="/orders" element={<OrderList orders={orders} />} />
                    <Route
                      path="/customers"
                      element={
                        <CustomerList
                          customers={customers}
                          onEditCustomer={handleOpenEditCustomer}
                          onToggleStatus={handleToggleCustomerStatus}
                          onAddFirstCustomer={handleOpenAddCustomer}
                        />
                      }
                    />
                    <Route path="*" element={<Navigate to="/products" replace />} />
                  </Routes>
                </div>
              </>
            )
          )}
        </div>
      </main>

      {/* Product Add/Edit Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSubmit={handleSaveProduct}
      />

      {/* Customer Add/Edit Modal */}
      <CustomerFormModal
        isOpen={isCustomerModalOpen}
        customerToEdit={customerToEdit}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setCustomerToEdit(null);
        }}
        onSubmit={handleSaveCustomer}
      />
    </div>
  );
}