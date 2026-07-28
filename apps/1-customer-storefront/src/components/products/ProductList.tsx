import type { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onToggleStatus?: (product: Product) => void;
  onDeleteProduct?: (id: string) => void;
  onAddFirstProduct: () => void;
}

export function ProductList({ products, onEditProduct, onToggleStatus, onDeleteProduct, onAddFirstProduct }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <svg className="w-12 h-12 mb-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-sm">No products in the database yet.</p>
        <button
          onClick={onAddFirstProduct}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg cursor-pointer"
        >
          + Add First Product
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Product Name</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {products.map((prod) => (
            <tr key={prod.id} className="hover:bg-slate-900/60 transition-colors">
              <td className="px-6 py-4 font-semibold text-white">{prod.name}</td>
              <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{prod.description || '—'}</td>
              <td className="px-6 py-4 font-mono text-emerald-400">
                ${prod.price.toFixed(2)} {prod.currency}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    prod.stockQuantity > 50
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                  }`}
                >
                  {prod.stockQuantity} in stock
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onToggleStatus && onToggleStatus(prod)}
                  title="Click to toggle active/inactive status"
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all hover:scale-105 ${
                    prod.isActive
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {prod.isActive ? '● Active' : '○ Inactive'}
                </button>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEditProduct(prod)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  {onDeleteProduct && (
                    <button
                      onClick={() => onDeleteProduct(prod.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 text-xs font-medium rounded-lg border border-slate-700 hover:border-red-800/50 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

