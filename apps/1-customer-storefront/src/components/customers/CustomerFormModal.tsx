import { useState, useEffect } from 'react';
import type { Customer, CustomerFormData } from '../../types';

interface CustomerFormModalProps {
  isOpen: boolean;
  customerToEdit?: Customer | null;
  onClose: () => void;
  onSubmit: (formData: CustomerFormData, editId?: string) => Promise<void>;
}

export function CustomerFormModal({ isOpen, customerToEdit, onClose, onSubmit }: CustomerFormModalProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        firstName: customerToEdit.firstName,
        lastName: customerToEdit.lastName,
        email: customerToEdit.email,
        isActive: customerToEdit.isActive ?? true,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        isActive: true,
      });
    }
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    setSubmitting(true);
    try {
      await onSubmit(formData, customerToEdit?.id);
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
          {customerToEdit ? 'Edit Customer' : 'Add New Customer'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="john.doe@example.com"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Account Status:</label>
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
              {formData.isActive ? 'Active Member' : 'Inactive'}
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
              {submitting ? 'Saving...' : customerToEdit ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
