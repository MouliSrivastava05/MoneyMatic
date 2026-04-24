import React from 'react';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n || 0));

const PALETTE = [
  'from-brand-600 to-brand-400',
  'from-indigo-600 to-indigo-400',
  'from-violet-600 to-violet-400',
  'from-amber-600 to-amber-400',
  'from-cyan-600 to-cyan-400',
  'from-fuchsia-600 to-fuchsia-400',
];

export default function CategorySpendingChart({ budgets = [], spendingByCategory = {} }) {
  if (!budgets.length) {
    return (
      <div className="card h-full flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-800/60">
          <svg className="h-7 w-7 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-ink-300 mb-1">No budgets yet</p>
        <p className="text-xs text-ink-500">Create budgets to visualise category performance.</p>
      </div>
    );
  }

  const items = budgets.map((b, i) => {
    const actual  = Number(spendingByCategory[b.category] || 0);
    const limit   = Number(b.limit || 0);
    const pct     = limit > 0 ? Math.min((actual / limit) * 100, 100) : 0;
    const isOver  = actual > limit;
    return { id: b.id, category: b.category, limit, actual, pct, isOver, palette: PALETTE[i % PALETTE.length] };
  });

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="eyebrow mb-0.5">Performance</p>
          <h3 className="section-title text-xl">Budget vs Actual</h3>
        </div>
        <span className="text-xs text-ink-500">This month</span>
      </div>

      <div className="flex-1 space-y-4">
        {items.map(({ id, category, limit, actual, pct, isOver, palette }) => (
          <div key={id}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-semibold text-ink-200">{category}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold font-mono ${isOver ? 'text-rose-400' : 'text-ink-400'}`}>
                  {fmt(actual)}
                </span>
                <span className="text-xs text-ink-600">/ {fmt(limit)}</span>
              </div>
            </div>
            <div className="relative h-2.5 rounded-full bg-ink-800 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${
                  isOver ? 'from-rose-600 to-rose-400' : palette
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-ink-600 mt-1">
              <span>{pct.toFixed(0)}% used</span>
              {isOver && <span className="text-rose-500 font-semibold">Over budget</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
