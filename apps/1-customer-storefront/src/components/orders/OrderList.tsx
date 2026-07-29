import type { Order } from '../../types';

interface OrderListProps {
  orders: Order[];
  onCreateOrder: () => void;
  onViewDetail: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onCancelOrder: (id: string) => void;
}

export function OrderList({ orders, onCreateOrder, onViewDetail, onUpdateStatus, onCancelOrder }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <svg className="w-12 h-12 mb-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">No orders in the database yet.</p>
        <button
          onClick={onCreateOrder}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg cursor-pointer"
        >
          + Create your first order
        </button>
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
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {orders.map((order) => {
            let statusClasses = '';
            let nextAction = null;
            
            switch (order.status) {
              case 'Pending':
                statusClasses = 'bg-amber-950 text-amber-400 border border-amber-800/40';
                nextAction = { label: 'Process', status: 'Processing', color: 'bg-sky-950 hover:bg-sky-900 text-sky-400 border-sky-800/40' };
                break;
              case 'Processing':
                statusClasses = 'bg-sky-950 text-sky-400 border border-sky-800/40';
                nextAction = { label: 'Ship', status: 'Shipped', color: 'bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border-indigo-800/40' };
                break;
              case 'Shipped':
                statusClasses = 'bg-indigo-950 text-indigo-300 border border-indigo-800/40';
                nextAction = { label: 'Deliver', status: 'Delivered', color: 'bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border-emerald-800/40' };
                break;
              case 'Delivered':
                statusClasses = 'bg-emerald-950 text-emerald-400 border border-emerald-800/40';
                break;
              case 'Cancelled':
                statusClasses = 'bg-red-950 text-red-400 border border-red-800/40';
                break;
              default:
                statusClasses = 'bg-slate-800 text-slate-400 border border-slate-700';
            }

            return (
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
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetail(order.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    {nextAction && (
                      <button
                        onClick={() => onUpdateStatus(order.id, nextAction.status)}
                        className={`px-3 py-1.5 ${nextAction.color} text-xs font-medium rounded-lg border transition-colors cursor-pointer`}
                      >
                        {nextAction.label}
                      </button>
                    )}
                    {(order.status === 'Pending' || order.status === 'Processing') && (
                      <button
                        onClick={() => onCancelOrder(order.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 text-xs font-medium rounded-lg border border-slate-700 hover:border-red-800/50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
