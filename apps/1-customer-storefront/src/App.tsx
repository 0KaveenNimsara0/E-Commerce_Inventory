import { useState, useEffect } from 'react';
import { fetchProducts, fetchOrders, fetchStats, createProduct, ApiError } from './services/api';
import type { Product, Order, SystemStats } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SystemStats>({ totalProducts: 0, pendingOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stockQuantity: '' });

  const loadData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [prodsData, ordersData, statsData] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchStats(),
      ]);
      setProducts(prodsData);
      setOrders(ordersData);
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    try {
      await createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity) || 0,
      });
      setNewProduct({ name: '', description: '', price: '', stockQuantity: '' });
      setIsAddingProduct(false);
      loadData();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create product.';
      alert(message);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col shadow-2xl z-10 shrink-0 border-r border-slate-800">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30 text-white">
            E
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white m-0 p-0">E-Commerce</h1>
            <p className="text-xs text-slate-400 font-medium m-0">Admin Workspace</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Inventory
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Orders
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-2 px-3 py-2 text-xs font-mono rounded-lg border ${
            apiError
              ? 'text-red-400 bg-red-950/50 border-red-800/40'
              : 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${apiError ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`}></span>
            {apiError ? 'DB Disconnected' : 'PostgreSQL Connected'}
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-900">

        {/* Header */}
        <header className="h-20 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white m-0">
              {activeTab === 'inventory' ? 'Inventory Overview' : 'Orders Management'}
            </h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">Live data from PostgreSQL via .NET 10 API</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            {activeTab === 'inventory' && (
              <button
                onClick={() => setIsAddingProduct(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
              >
                + Add Product
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">

          {/* Error Banner */}
          {apiError && (
            <div className="mb-6 flex items-start gap-3 bg-red-950/60 border border-red-800/50 text-red-300 rounded-xl px-5 py-4">
              <svg className="w-5 h-5 mt-0.5 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-red-200 text-sm">Cannot connect to the database</p>
                <p className="text-xs mt-0.5 text-red-400">{apiError}</p>
              </div>
              <button
                onClick={loadData}
                className="ml-auto shrink-0 text-xs bg-red-900 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <svg className="w-10 h-10 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-slate-400 text-sm">Loading data from PostgreSQL...</p>
            </div>
          )}

          {/* Main content — only shown when not loading */}
          {!loading && !apiError && (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pending Orders</p>
                  <p className="text-3xl font-bold text-indigo-400">{stats.pendingOrders}</p>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                {activeTab === 'inventory' ? (
                  products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                      <svg className="w-12 h-12 mb-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="text-sm">No products in the database yet.</p>
                      <button onClick={() => setIsAddingProduct(true)} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg cursor-pointer">
                        + Add First Product
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {products.map((prod) => (
                            <tr key={prod.id} className="hover:bg-slate-900/60 transition-colors">
                              <td className="px-6 py-4 font-semibold text-white">{prod.name}</td>
                              <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{prod.description}</td>
                              <td className="px-6 py-4 font-mono text-emerald-400">${prod.price.toFixed(2)} {prod.currency}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${prod.stockQuantity > 50 ? 'bg-slate-800 text-slate-300' : 'bg-amber-950 text-amber-400 border border-amber-800/40'}`}>
                                  {prod.stockQuantity} in stock
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                                  {prod.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                      <svg className="w-12 h-12 mb-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm">No orders in the database yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer ID</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Total Amount</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                              <td className="px-6 py-4 font-mono font-medium text-indigo-300">{order.id.slice(0, 8)}...</td>
                              <td className="px-6 py-4 font-mono text-slate-400">{order.customerId.slice(0, 8)}...</td>
                              <td className="px-6 py-4">{order.itemsCount} item(s)</td>
                              <td className="px-6 py-4 font-mono text-emerald-400">${order.totalAmount.toFixed(2)} {order.currency}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  order.status === 'Pending'
                                    ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                                    : 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            </>
          )}

        </div>
      </main>

      {/* ADD PRODUCT MODAL */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Add New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Wireless Headset"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Product summary..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}