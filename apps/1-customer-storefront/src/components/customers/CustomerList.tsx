import type { Customer } from '../../types';

interface CustomerListProps {
  customers: Customer[];
  onEditCustomer: (customer: Customer) => void;
  onToggleStatus: (customer: Customer) => void;
  onAddFirstCustomer: () => void;
}

export function CustomerList({ customers, onEditCustomer, onToggleStatus, onAddFirstCustomer }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <svg className="w-12 h-12 mb-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p className="text-sm">No customers registered in the database yet.</p>
        <button
          onClick={onAddFirstCustomer}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg cursor-pointer"
        >
          + Add First Customer
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Customer ID</th>
            <th className="px-6 py-4">Full Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-slate-900/60 transition-colors">
              <td className="px-6 py-4 font-mono text-slate-400">{c.id.slice(0, 8)}...</td>
              <td className="px-6 py-4 font-semibold text-white">{c.fullName || `${c.firstName} ${c.lastName}`}</td>
              <td className="px-6 py-4 text-indigo-300 font-mono">{c.email}</td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onToggleStatus(c)}
                  title="Click to toggle customer active/inactive status"
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all hover:scale-105 ${
                    c.isActive
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {c.isActive ? '● Active Member' : '○ Inactive'}
                </button>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onEditCustomer(c)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
