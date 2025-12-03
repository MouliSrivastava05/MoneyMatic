import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', to: '/dashboard' },
  { id: 'transactions', label: 'Transactions', to: '/transactions' },
  { id: 'budgets', label: 'Budgets', to: '/budgets' },
  { id: 'reminders', label: 'Reminders', to: '/reminders' },
];

export default function ShellHeader({ active = 'dashboard', user, onLogout }) {
  const navigate = useNavigate();
  const displayName = user?.name || 'MoneyMatic';

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-white/70 shadow-[0_10px_40px_-35px_rgba(15,23,42,1)] backdrop-blur-lg dark:bg-ink-900/70 dark:border-ink-800">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-left shadow-soft transition hover:shadow-glow dark:bg-ink-800/60 dark:border-ink-700"
        >
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-brand-start to-brand-end shadow-soft" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-500">
              MoneyMatic
            </p>
            <p className="text-sm font-semibold text-ink-900 dark:text-white">Control Center</p>
          </div>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active === item.id
                  ? 'bg-ink-900 text-white shadow-soft dark:bg-white dark:text-ink-900'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className={`hidden sm:flex rounded-full px-4 py-2 text-sm font-medium transition ${
              active === 'settings'
                ? 'bg-ink-900 text-white shadow-soft dark:bg-white dark:text-ink-900'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            Settings
          </Link>
          <span className="hidden text-sm text-ink-600 dark:text-ink-300 sm:inline-flex">
            {displayName}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="btn-outline text-xs sm:text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}



