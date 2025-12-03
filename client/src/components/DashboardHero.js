import React from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export default function DashboardHero({ onExplore, onLearn, budgetData, remindersCount = 0 }) {
  const income = budgetData?.summary?.totalIncome || 0;
  const expenses = budgetData?.summary?.totalExpenses || 0;
  const savings = budgetData?.summary?.savings || 0;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(0) : 0;
  const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;
  
  // Calculate upcoming reminders (within next 7 days)
  const isOnTrack = savings >= 0 && expenseRatio < 100;

  return (
    <section className="relative overflow-hidden rounded-[48px] border border-white/10 bg-black p-10 text-white shadow-[0_90px_160px_-90px_rgba(0,0,0,0.85)]">
      {/* Subtle animated glow inside the hero only */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(79,70,229,0.5),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(45,212,191,0.4),transparent_55%)] opacity-40 blur-[120px] animate-[heroGlow_10s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%)] mix-blend-soft-light" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.4fr,1fr] items-center">
        {/* Left: copy + actions */}
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.6em] text-white/70">
            Personal finance, de-noised
          </p>
          <h1 className="text-4xl font-semibold tracking-tight leading-tight md:text-5xl">
            Stay ahead of your money in an ever‑changing world.
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-xl">
            MoneyMatic turns scattered statements into one live dashboard, so you always know what to pay, what to cut, and what you can safely save.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onExplore}
              className="btn-primary px-6 py-3 text-base shadow-glow bg-gradient-to-r from-brand-start to-brand-end"
            >
              View this month&apos;s story
            </button>
            <button
              type="button"
              onClick={onLearn}
              className="btn-ghost px-6 py-3 text-base border border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              See how tracking works
            </button>
          </div>
        </div>

        {/* Right: Live snapshot card with real data */}
        <div className="relative flex items-center justify-center">
          <div className="relative h-64 w-full max-w-xs origin-center -rotate-6 rounded-[32px] border border-white/15 bg-gradient-to-br from-[#111827] via-[#020617] to-[#020617] p-5 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.9)]">
            <div className="absolute -top-4 -left-4 h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-start to-brand-end opacity-80 blur-sm" />
            <div className="absolute -bottom-6 right-6 h-16 w-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-brand-400 opacity-70 blur" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Live snapshot</p>
                <p className="mt-1 text-lg font-semibold">This month&apos;s cashflow</p>
              </div>

              <div className="space-y-3 text-xs text-white/80">
                <div>
                  <p className="mb-1 flex items-center justify-between">
                    <span>Income vs expenses</span>
                    <span className="text-emerald-300 font-semibold">
                      {formatCurrency(income)} / {formatCurrency(expenses)}
                    </span>
                  </p>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500"
                      style={{ width: `${Math.min(expenseRatio, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-1 flex items-center justify-between">
                    <span>Savings rate</span>
                    <span className="text-brand-200 font-semibold">{savingsRate}%</span>
                  </p>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-brand-start to-brand-end transition-all duration-500"
                      style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-white/70">
                <span>
                  {remindersCount > 0 
                    ? `${remindersCount} reminder${remindersCount !== 1 ? 's' : ''} this week`
                    : 'No upcoming reminders'
                  }
                </span>
                <span className={`rounded-full px-3 py-1 ${
                  isOnTrack 
                    ? 'bg-emerald-500/20 text-emerald-200'
                    : 'bg-rose-500/20 text-rose-200'
                }`}>
                  {isOnTrack ? 'On track' : 'Review needed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
