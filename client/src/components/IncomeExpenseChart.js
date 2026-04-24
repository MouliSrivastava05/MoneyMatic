import React from 'react';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n || 0));

export default function IncomeExpenseChart({ income = 0, expense = 0, savings = 0 }) {
  const maxValue     = Math.max(income, expense, 1);
  const incomeWidth  = Math.round((income  / maxValue) * 100);
  const expenseWidth = Math.round((expense / maxValue) * 100);
  const savingsRate  = income > 0 ? ((savings / income) * 100).toFixed(0) : 0;

  const bars = [
    {
      label: 'Income',
      value: income,
      width: incomeWidth,
      bar: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
      track: 'bg-emerald-500/10',
      color: 'text-emerald-400',
    },
    {
      label: 'Expenses',
      value: expense,
      width: expenseWidth,
      bar: 'bg-gradient-to-r from-rose-600 to-rose-400',
      track: 'bg-rose-500/10',
      color: 'text-rose-400',
    },
  ];

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="eyebrow mb-0.5">Cashflow</p>
          <h3 className="section-title text-xl">Monthly Flow</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-ink-500 mb-0.5">Net savings</p>
          <p className={`text-lg font-bold font-mono ${savings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {fmt(savings)}
          </p>
        </div>
      </div>

      {/* Bars */}
      <div className="flex-1 space-y-5">
        {bars.map(({ label, value, width, bar, track, color }) => (
          <div key={label}>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-ink-300">{label}</span>
              <span className={`font-bold font-mono ${color}`}>{fmt(value)}</span>
            </div>
            <div className={`h-3 rounded-full ${track} overflow-hidden`}>
              <div
                className={`h-full rounded-full ${bar} transition-all duration-700 ease-out`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer metric */}
      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-xs text-ink-500">Savings rate this month</span>
        <span className={`text-sm font-bold ${Number(savingsRate) >= 20 ? 'text-brand-400' : Number(savingsRate) >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
          {savingsRate}%
        </span>
      </div>
    </div>
  );
}
