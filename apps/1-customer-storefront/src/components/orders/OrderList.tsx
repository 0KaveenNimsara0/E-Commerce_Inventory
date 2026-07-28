import type { Order } from '../../types';

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <svg className="w-12 h-12 mb-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">No orders in the database yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Customer ID</th>
            <th className="px-6 py-4">Items Count</th>
            <th className="px-6 py-4">Total Amount</th>
            <th className="px-6 py-4">Created At</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
              <td className="px-6 py-4 font-mono font-medium text-indigo-300">{order.id.slice(0, 8)}...</td>
              <td className="px-6 py-4 font-mono text-slate-400">{order.customerId.slice(0, 8)}...</td>
              <td className="px-6 py-4">{order.itemsCount} item(s)</td>
              <td className="px-6 py-4 font-mono text-emerald-400">
                ${order.totalAmount.toFixed(2)} {order.currency}
              </td>
              <td className="px-6 py-4 text-xs text-slate-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Pending'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
