import { useState, useEffect } from 'react';
import type { Product, ProductFormData } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
  onSubmit: (formData: ProductFormData, editId?: string) => Promise<void>;
}

export function ProductFormModal({ isOpen, productToEdit, onClose, onSubmit }: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price.toString(),
        stockQuantity: productToEdit.stockQuantity.toString(),
        isActive: productToEdit.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        isActive: true,
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    setSubmitting(true);
    try {
      await onSubmit(formData, productToEdit?.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">
          {productToEdit ? 'Edit Product' : 'Add New Product'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Wireless Headset"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Product summary..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="29.99"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="100"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Product Status:</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
                formData.isActive
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
              {formData.isActive ? 'Active' : 'Inactive'}
            </button>
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
              {submitting ? 'Saving...' : productToEdit ? 'Update Product' : 'Save to Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
