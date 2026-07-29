import { NavLink } from 'react-router-dom';

interface SidebarProps {
  apiError: string | null;
}

export function Sidebar({ apiError }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col shadow-2xl z-10 shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30 text-white">
          E
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white m-0 p-0">E-Commerce</h1>
          <p className="text-xs text-slate-400 font-medium m-0">Admin Workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Products
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Orders
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Customers
        </NavLink>
      </nav>

      {/* Database Connection Status Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-2 px-3 py-2 text-xs font-mono rounded-lg border ${
          apiError
            ? 'text-red-400 bg-red-950/50 border-red-800/40'
            : 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40'
        }`}>
          <span className={`w-2 h-2 rounded-full ${apiError ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`}></span>
          {apiError ? 'DB Disconnected' : 'PostgreSQL Connected'}
        </div>
      </div>
    </aside>
  );
}
