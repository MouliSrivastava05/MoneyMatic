import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-ink-100/70 bg-white/70 backdrop-blur-xs dark:bg-ink-900/60 dark:border-ink-800">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-start to-brand-end" />
            <span className="font-display text-lg tracking-tight">MoneyMatic</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-600 dark:text-ink-400">
              {user.name || 'User'}
            </span>
            <button onClick={handleLogout} className="btn-ghost text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink-900 dark:text-ink-100">
            Dashboard
          </h1>
          <p className="mt-2 text-ink-600 dark:text-ink-400">
            Welcome back, {user.name || 'User'}!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card">
            <h3 className="font-medium mb-2">Total Balance</h3>
            <p className="text-2xl font-semibold text-brand-600">$0.00</p>
          </div>
          <div className="card">
            <h3 className="font-medium mb-2">This Month</h3>
            <p className="text-2xl font-semibold text-ink-900 dark:text-ink-100">$0.00</p>
          </div>
          <div className="card">
            <h3 className="font-medium mb-2">Savings</h3>
            <p className="text-2xl font-semibold text-emerald-600">$0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

