import type { OrderDetail } from '../../types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail | null;
  onUpdateStatus: (id: string, status: string) => void;
  onCancelOrder: (id: string) => void;
}

export function OrderDetailModal({ isOpen, onClose, order, onUpdateStatus, onCancelOrder }: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  let statusClasses = '';
  let nextAction = null;
  
  switch (order.status) {
    case 'Pending':
      statusClasses = 'bg-amber-950 text-amber-400 border border-amber-800/40';
      nextAction = { label: 'Process Order', status: 'Processing', color: 'bg-sky-600 hover:bg-sky-500 text-white' };
      break;
    case 'Processing':
      statusClasses = 'bg-sky-950 text-sky-400 border border-sky-800/40';
      nextAction = { label: 'Ship Order', status: 'Shipped', color: 'bg-indigo-600 hover:bg-indigo-500 text-white' };
      break;
    case 'Shipped':
      statusClasses = 'bg-indigo-950 text-indigo-300 border border-indigo-800/40';
      nextAction = { label: 'Mark as Delivered', status: 'Delivered', color: 'bg-emerald-600 hover:bg-emerald-500 text-white' };
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-3xl shadow-2xl my-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Order Details</h3>
            <p className="text-sm text-slate-400 font-mono">{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Customer</p>
            <p className="text-white font-medium">{order.customerName}</p>
            <p className="text-sm text-slate-500 font-mono mt-1">{order.customerId}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Status & Date</p>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
                {order.status}
              </span>
              <span className="text-sm text-slate-400">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3">Order Items</h4>
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/30">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 font-medium text-white">{item.productName}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-400">${item.subTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900/80 border-t border-slate-800">
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-right font-semibold text-white">Grand Total</td>
                  <td className="px-4 py-4 text-right font-mono font-bold text-lg text-emerald-400">
                    ${order.totalAmount.toFixed(2)} {order.currency}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
          {(order.status === 'Pending' || order.status === 'Processing') && (
            <button
              onClick={() => onCancelOrder(order.id)}
              className="px-4 py-2 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg text-sm font-medium border border-slate-700 hover:border-red-800/50 transition-colors cursor-pointer mr-auto"
            >
              Cancel Order
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium cursor-pointer"
          >
            Close
          </button>
          
          {nextAction && (
            <button
              onClick={() => onUpdateStatus(order.id, nextAction.status)}
              className={`px-4 py-2 ${nextAction.color} rounded-lg text-sm font-semibold cursor-pointer shadow-lg`}
            >
              {nextAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
