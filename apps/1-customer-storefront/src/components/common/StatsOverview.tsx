import type { SystemStats } from '../../types';

interface StatsOverviewProps {
  stats: SystemStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Products</p>
        <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
      </div>

      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pending Orders</p>
        <p className="text-3xl font-bold text-indigo-400">{stats.pendingOrders}</p>
      </div>

      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Customers</p>
        <p className="text-3xl font-bold text-sky-400">{stats.totalCustomers || 0}</p>
      </div>

      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</p>
        <p className="text-3xl font-bold text-emerald-400">
          ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
