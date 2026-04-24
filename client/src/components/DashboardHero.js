import React from 'react';
import { useNavigate } from 'react-router-dom';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n || 0);

export default function DashboardHero({ onExplore, budgetData, remindersCount = 0 }) {
  const navigate = useNavigate();
  const income   = budgetData?.summary?.totalIncome    || 0;
  const expenses = budgetData?.summary?.totalExpenses  || 0;
  const savings  = budgetData?.summary?.savings        || 0;
  const savingsRate  = income > 0 ? ((savings  / income) * 100).toFixed(0) : 0;
  const expenseRatio = income > 0 ? ((expenses / income) * 100).toFixed(0) : 0;
  const isOnTrack    = savings >= 0 && expenseRatio < 100;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-ink-950 p-8 lg:p-12 shadow-elevated">
      {/* Background radial glows */}
      <div
        className="pointer-events-none absolute inset-0 animate-[heroGlow_10s_ease-in-out_infinite]"
        style={{
          background:
            'radial-gradient(circle at 15% 0%, rgba(20,184,166,0.18) 0%, transparent 55%), ' +
            'radial-gradient(circle at 85% 15%, rgba(99,102,241,0.14) 0%, transparent 55%), ' +
            'radial-gradient(circle at 50% 100%, rgba(20,184,166,0.08) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Top border gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.5fr,1fr] items-center">
        {/* ── Left copy ── */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-brand-500" />
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-brand-400">
              Personal finance, de‑noised
            </p>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white lg:text-5xl text-balance">
            Stay ahead of your{' '}
            <span className="text-gradient">money</span>{' '}
            in an ever-changing world.
          </h1>

          <p className="text-base text-ink-400 leading-relaxed max-w-lg">
            MoneyMatic turns scattered statements into one live dashboard — so you always know what to pay, what to cut, and what you can safely save.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={onExplore}
              className="btn-primary btn-lg"
            >
              View this month's story
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => navigate('/personal-finance-guide')}
              className="btn-ghost btn-lg"
            >
              Finance Guide
            </button>
          </div>

          {/* Quick KPI row */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { label: 'Income',   value: fmt(income),   color: 'text-emerald-400' },
              { label: 'Expenses', value: fmt(expenses), color: 'text-rose-400' },
              { label: 'Saved',    value: fmt(savings),  color: 'text-brand-400' },
            ].map((kpi) => (
              <div key={kpi.label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-500">{kpi.label}</span>
                <span className={`text-xl font-bold font-mono ${kpi.color}`}>{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right snapshot card ── */}
        <div className="flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <div className="relative w-full max-w-[300px]">
            {/* Card glow */}
            <div className="absolute -inset-4 rounded-3xl bg-brand-500/10 blur-2xl" />

            {/* Card */}
            <div className="relative rounded-2xl border border-white/10 bg-ink-900/80 backdrop-blur-xl p-5 shadow-elevated ring-1 ring-inset ring-white/[0.06]">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-500">Live Snapshot</p>
                  <p className="text-sm font-semibold text-white mt-0.5">This month's cashflow</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    isOnTrack
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {isOnTrack ? '✓ On track' : '⚠ Review'}
                </span>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                {/* Income vs Expenses bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-ink-400 font-medium">Expense ratio</span>
                    <span className="font-bold text-white">{expenseRatio}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-700"
                      style={{ width: `${Math.min(Number(expenseRatio), 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-ink-500 mt-1.5">
                    <span>{fmt(expenses)} spent</span>
                    <span>{fmt(income)} earned</span>
                  </div>
                </div>

                {/* Savings rate bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-ink-400 font-medium">Savings rate</span>
                    <span className="font-bold text-brand-400">{savingsRate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-700"
                      style={{ width: `${Math.min(Math.max(Number(savingsRate), 0), 100)}%` }}
                    />
                  </div>
                </div>

                {/* Reminders pill */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 text-xs text-ink-400">
                  <span className="text-brand-400">◌</span>
                  {remindersCount > 0
                    ? `${remindersCount} reminder${remindersCount !== 1 ? 's' : ''} due this week`
                    : 'No upcoming reminders'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
