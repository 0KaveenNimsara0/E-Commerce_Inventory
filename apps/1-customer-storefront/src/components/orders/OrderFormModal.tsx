import { useState, useEffect } from 'react';
import type { Customer, Product, OrderFormData, OrderItemFormData } from '../../types';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: OrderFormData) => Promise<void>;
  customers: Customer[];
  products: Product[];
}

export function OrderFormModal({ isOpen, onClose, onSubmit, customers, products }: OrderFormModalProps) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<OrderItemFormData[]>([{ productId: '', quantity: '1' }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomerId('');
      setItems([{ productId: '', quantity: '1' }]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeCustomers = customers.filter(c => c.isActive);
  const activeProducts = products.filter(p => p.isActive && p.stockQuantity > 0);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = activeProducts.find(p => p.id === item.productId);
      if (product && item.quantity) {
        return total + product.price * parseInt(item.quantity, 10);
      }
      return total;
    }, 0);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: '1' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItemFormData, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || items.some(item => !item.productId || !item.quantity)) return;

    setSubmitting(true);
    try {
      await onSubmit({ customerId, items });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8">
        <h3 className="text-xl font-bold text-white mb-4">Create New Order</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Customer</label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select a customer</option>
              {activeCustomers.map(c => (
                <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-400 uppercase">Order Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                + Add Item
              </button>
            </div>
            
            {items.map((item, index) => {
              const selectedProduct = activeProducts.find(p => p.id === item.productId);
              return (
                <div key={index} className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                  <div className="flex-1">
                    <select
                      required
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Select a product</option>
                      {activeProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ${p.price.toFixed(2)} ({p.stockQuantity} in stock)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      required
                      min="1"
                      max={selectedProduct ? selectedProduct.stockQuantity : undefined}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Qty"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <span className="text-slate-400 font-medium">Total:</span>
            <span className="text-xl font-bold text-emerald-400">${calculateTotal().toFixed(2)}</span>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
