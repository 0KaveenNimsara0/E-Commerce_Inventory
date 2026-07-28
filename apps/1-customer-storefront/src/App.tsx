import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* --- MODERN DARK SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shadow-2xl z-10 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">
            E
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">E-Commerce</h1>
            <p className="text-xs text-slate-400 font-medium">Admin Workspace</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'inventory' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            {/* Box Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Inventory
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'orders' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            {/* Shopping Cart Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Orders
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            {/* Logout Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'inventory' ? 'Inventory Overview' : 'Orders Management'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
              {/* Notification Bell */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-slate-800">1,248</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-indigo-600">32</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-emerald-600">$45,231</p>
            </div>
          </div>

          {/* Main Data Area (Placeholder for actual tables) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              {activeTab === 'inventory' 
                ? <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                : <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              }
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {activeTab === 'inventory' ? 'No Products Loaded' : 'No Orders Loaded'}
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              {activeTab === 'inventory'
                ? 'Connect to your .NET Core API to view, add, and manage your inventory here.'
                : 'Once customers place orders through the API, they will appear in this table.'}
            </p>
            <button className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/30">
              Refresh Data
            </button>
          </div>

        </div>
      </main>
      
    </div>
  );
}