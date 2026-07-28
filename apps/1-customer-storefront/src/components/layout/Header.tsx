import type { TabType } from '../../types';

interface HeaderProps {
  activeTab: TabType;
  loading: boolean;
  onRefresh: () => void;
  onAddProduct: () => void;
  onAddCustomer: () => void;
}

export function Header({ activeTab, loading, onRefresh, onAddProduct, onAddCustomer }: HeaderProps) {
  const titles: Record<TabType, { title: string; subtitle: string }> = {
    products: {
      title: 'Products & Inventory',
      subtitle: 'Manage products, stock levels, and pricing',
    },
    orders: {
      title: 'Orders Management',
      subtitle: 'Monitor pending and completed customer orders',
    },
    customers: {
      title: 'Customers Directory',
      subtitle: 'Manage customer accounts and contact information',
    },
  };

  return (
    <header className="h-20 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
      <div>
        <h2 className="text-xl font-bold text-white m-0">{titles[activeTab].title}</h2>
        <p className="text-xs text-slate-400 m-0 mt-0.5">{titles[activeTab].subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-2 cursor-pointer"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>

        {activeTab === 'products' && (
          <button
            onClick={onAddProduct}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            + Add Product
          </button>
        )}

        {activeTab === 'customers' && (
          <button
            onClick={onAddCustomer}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            + Add Customer
          </button>
        )}
      </div>
    </header>
  );
}
