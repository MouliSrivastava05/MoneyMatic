import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    to: '/dashboard',    icon: '⊞' },
  { id: 'transactions', label: 'Transactions', to: '/transactions', icon: '⇄' },
  { id: 'budgets',      label: 'Budgets',      to: '/budgets',      icon: '◎' },
  { id: 'reminders',    label: 'Reminders',    to: '/reminders',    icon: '◌' },
];

export default function ShellHeader({ active = 'dashboard', user, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = user?.name || 'User';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30">
      {/* Backdrop blur bar */}
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-xl border-b border-white/[0.06]" />

      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 group"
        >
          <AnimatedLogo size="sm" />
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-500 leading-none">
              MoneyMatic
            </p>
            <p className="text-sm font-semibold text-white leading-tight group-hover:text-brand-300 transition-colors">
              Control Center
            </p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={
                active === item.id
                  ? 'nav-link-active'
                  : 'nav-link'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: user + logout */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white shadow-brand select-none">
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-ink-300 sm:inline">
            {displayName}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="btn btn-ghost btn-sm"
          >
            Sign out
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-400 hover:text-white hover:bg-white/5 transition md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-white/[0.06] bg-ink-950/95 backdrop-blur-xl md:hidden animate-scale-in">
          <nav className="flex flex-col gap-1 p-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active === item.id
                    ? 'bg-brand-500/15 text-brand-300'
                    : 'text-ink-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
